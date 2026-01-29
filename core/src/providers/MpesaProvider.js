/**
 * MpesaProvider - Native Safaricom (Kenya) implementation
 */

import { ProviderError, ConfigurationError, NetworkError, PaymentError } from '../errors.js';

const URLS = {
    sandbox: {
        auth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate',
        stk: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    },
    production: {
        auth: 'https://api.safaricom.co.ke/oauth/v1/generate',
        stk: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    }
};

export class MpesaProvider {
    constructor(config = {}) {
        this.name = 'mpesa';
        this.credentials = config.credentials || {};
        this.environment = config.environment || 'sandbox';
        this.accessToken = null;
        this.tokenExpiry = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        this._validateCredentials();
        this.isInitialized = true;
    }

    _validateCredentials() {
        // We require Consumer Key, Consumer Secret, Shortcode, and Passkey
        // Map apiKey -> Consumer Key, publicKey -> Consumer Secret for backward compat if needed
        const { consumerKey, consumerSecret, shortcode, passkey, apiKey, publicKey, serviceProviderCode } = this.credentials;

        // Normalize
        this.consumerKey = consumerKey || apiKey;
        this.consumerSecret = consumerSecret || publicKey;
        this.shortcode = shortcode || serviceProviderCode;
        this.passkey = passkey;

        const missing = [];
        if (!this.consumerKey) missing.push('consumerKey');
        if (!this.consumerSecret) missing.push('consumerSecret');
        if (!this.shortcode) missing.push('shortcode');
        if (!this.passkey) missing.push('passkey');

        if (missing.length > 0) {
            throw new ConfigurationError(
                `Missing M-Pesa credentials: ${missing.join(', ')}`,
                missing
            );
        }
    }

    async _getAccessToken() {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

        try {
            const url = `${URLS[this.environment].auth}?grant_type=client_credentials`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new NetworkError(`Auth failed: ${response.status} ${text}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // expires_in is in seconds. Subtract a 60s buffer.
            this.tokenExpiry = Date.now() + (parseInt(data.expires_in) * 1000) - 60000;
            return this.accessToken;
        } catch (error) {
            throw new ProviderError(`Auth Error: ${error.message}`, this.name, error);
        }
    }

    _generatePassword(shortcode, passkey, timestamp) {
        const raw = `${shortcode}${passkey}${timestamp}`;
        // Verify environment supports Buffer (Node.js) or needs btoa (Browser)
        // Since Core SDK might run in Node, Buffer is safe. For browser, polyfill/shim might be needed.
        // But typically this SDK is used server-side or in Edge Functions.
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(raw).toString('base64');
        } else {
            return btoa(raw);
        }
    }

    async charge(request) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const token = await this._getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
            const password = this._generatePassword(this.shortcode, this.passkey, timestamp);

            // Normalize phone (Basic Kenya normalization)
            let phone = request.customerPhone.replace('+', '');
            if (phone.startsWith('0')) phone = '254' + phone.substring(1);
            if (!phone.startsWith('254')) phone = '254' + phone;

            // STK Push Payload
            const payload = {
                "BusinessShortCode": this.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": Math.round(request.amount),
                "PartyA": phone,
                "PartyB": this.shortcode,
                "PhoneNumber": phone,
                "CallBackURL": request.callbackUrl || "https://example.com/callback_placeholder",
                "AccountReference": request.reference || "Payment",
                "TransactionDesc": request.description || "Payment"
            };

            const response = await fetch(URLS[this.environment].stk, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.ResponseCode !== "0") {
                throw new PaymentError(`${data.ResponseCode}: ${data.ResponseDescription}`, data.ResponseCode, request.transactionReference);
            }

            return {
                success: true,
                transactionId: data.CheckoutRequestID,
                externalTransactionId: data.MerchantRequestID,
                status: 'pending', // STK Push is async
                providerCode: data.ResponseCode,
                providerMessage: data.ResponseDescription,
                rawResponse: data
            };

        } catch (error) {
            if (error instanceof ProviderError || error instanceof PaymentError || error instanceof NetworkError) {
                throw error;
            }
            throw new PaymentError(`STK Push failed: ${error.message}`);
        }
    }

    // Placeholder for other methods
    async refund(transactionId, amount, reference) {
        throw new Error("Refunds are not yet implemented for the Native Kenya Provider.");
    }

    async queryStatus(queryRef) {
        throw new Error("Query Status is not yet implemented for the Native Kenya Provider.");
    }
}
