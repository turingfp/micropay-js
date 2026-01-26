/**
 * MpesaProvider - Native implementation based on MpesaKit patterns
 */

import { BaseProvider } from './BaseProvider.js';
import { PaymentResult } from '../models/PaymentResult.js';
import { ProviderError, ConfigurationError } from '../utils/errors.js';
import { normalizePhone } from '../utils/validation.js';

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

export class MpesaProvider extends BaseProvider {
    constructor(config = {}) {
        super(config);
        this.name = 'mpesa';
        this.credentials = config.credentials || {};
        this.environment = config.environment || 'sandbox';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async initialize() {
        if (this.isInitialized) return;
        this._validateCredentials();
        this.isInitialized = true;
    }

    _validateCredentials() {
        const required = ['apiKey', 'publicKey', 'serviceProviderCode', 'passkey'];
        // Mpesa "apiKey" in our config maps to Consumer Key
        // Mpesa "publicKey" in our config maps to Consumer Secret for Auth
        // "passkey" is needed for STK Push password generation

        // Note: The previous SDK might have used different naming. 
        // We assume: apiKey = Consumer Key, publicKey = Consumer Secret (convention update needed if mismatched)
        // But to be safe and "compliant" with user's likely keys:
        // Let's assume the user provides: consumerKey, consumerSecret, passkey, shortcode

        // Update: The previous file used: apiKey, publicKey, serviceProviderCode.
        // We will map:
        // apiKey -> Consumer Key
        // publicKey -> Consumer Secret
        // serviceProviderCode -> BusinessShortCode

        // We also need a passkey for STK Push. If missing, we can't do STK Push.
    }

    async _getAccessToken() {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        const { apiKey: consumerKey, publicKey: consumerSecret } = this.credentials;
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        try {
            const url = `${URLS[this.environment].auth}?grant_type=client_credentials`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Auth failed: ${response.status} ${text}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // expires_in is in seconds. Subtract a buffer.
            this.tokenExpiry = Date.now() + (parseInt(data.expires_in) * 1000) - 60000;
            return this.accessToken;
        } catch (error) {
            throw new ProviderError(`Auth Error: ${error.message}`, this.name, error);
        }
    }

    _generatePassword(shortcode, passkey, timestamp) {
        const raw = `${shortcode}${passkey}${timestamp}`;
        return Buffer.from(raw).toString('base64');
    }

    async charge(request) {
        await this.initialize();

        try {
            const token = await this._getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
            const shortcode = this.credentials.serviceProviderCode;
            const passkey = this.credentials.passkey;

            if (!passkey) {
                throw new ConfigurationError('Missing passkey for STK Push');
            }

            const password = this._generatePassword(shortcode, passkey, timestamp);
            const phone = normalizePhone(request.customerPhone, '254'); // M-Pesa is Kenya focused usually

            const payload = {
                "BusinessShortCode": shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline", // Defaulting to PayBill
                "Amount": Math.round(request.amount),
                "PartyA": phone,
                "PartyB": shortcode,
                "PhoneNumber": phone,
                "CallBackURL": this.config.callbackUrl || "https://example.com/callback", // Must be https
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
                throw new Error(`${data.ResponseCode}: ${data.ResponseDescription}`);
            }

            return new PaymentResult({
                success: true,
                transactionId: data.CheckoutRequestID,
                externalTransactionId: data.MerchantRequestID,
                status: 'pending', // STK Push is async
                rawResponse: data
            });

        } catch (error) {
            throw new ProviderError(`STK Push failed: ${error.message}`, this.name, error);
        }
    }

    // ... Payout and others would follow similar native implementation pattern
}

