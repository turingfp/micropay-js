/**
 * MpesaProvider - Native Safaricom (Kenya) implementation
 * 
 * Production-Ready Implementation with:
 * - Query Status polling (STK Push Query)
 * - Dynamic Callback URLs
 * - Robust phone normalization (Multi-Country)
 */

import { ProviderError, ConfigurationError, NetworkError, PaymentError } from '../errors.cjs';
import { normalizePhone } from '../utils/PhoneUtils.cjs';
const URLS = {
  sandbox: {
    auth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate',
    stk: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    stkQuery: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
  },
  production: {
    auth: 'https://api.safaricom.co.ke/oauth/v1/generate',
    stk: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    stkQuery: 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
  }
};

// Country Prefixes for East Africa
const COUNTRY_PREFIXES = {
  KE: '254',
  // Kenya
  TZ: '255',
  // Tanzania
  UG: '256',
  // Uganda
  RW: '250',
  // Rwanda
  MW: '265' // Malawi
};
export class MpesaProvider {
  constructor(config = {}) {
    this.name = 'mpesa';
    this.credentials = config.credentials || {};
    this.environment = config.environment || 'sandbox';
    this.callbackUrl = config.callbackUrl || null; // Required for production
    this.country = config.country || 'KE'; // Default Kenya
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
    const {
      consumerKey,
      consumerSecret,
      shortcode,
      passkey,
      apiKey,
      publicKey,
      serviceProviderCode
    } = this.credentials;

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
      throw new ConfigurationError(`Missing M-Pesa credentials: ${missing.join(', ')}`, missing);
    }

    // Warn if callback URL is not set for production
    if (this.environment === 'production' && !this.callbackUrl) {
      console.warn('[MpesaProvider] No callbackUrl configured. This is required for production.');
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
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      if (!response.ok) {
        const text = await response.text();
        throw new NetworkError(`Auth failed: ${response.status} ${text}`);
      }
      const data = await response.cjson();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + parseInt(data.expires_in) * 1000 - 60000;
      return this.accessToken;
    } catch (error) {
      throw new ProviderError(`Auth Error: ${error.message}`, this.name, error);
    }
  }
  _generatePassword(shortcode, passkey, timestamp) {
    const raw = `${shortcode}${passkey}${timestamp}`;
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(raw).toString('base64');
    } else {
      return btoa(raw);
    }
  }

  /**
   * Normalizes phone numbers to E.164 format for the configured country.
   * Handles local formats (e.g., 0712...) and international formats (e.g., +254712...).
   * 
   * @param {string} phone - Raw phone number input
   * @returns {string} Normalized phone number without '+' prefix
   */
  _normalizePhone(phone) {
    return normalizePhone(phone, this.country);
  }
  async charge(request) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Validate Callback URL
    const callbackUrl = request.callbackUrl || this.callbackUrl;
    if (!callbackUrl) {
      throw new ConfigurationError('Missing callbackUrl. A valid HTTPS URL is required for M-Pesa STK Push in production.', ['callbackUrl']);
    }
    if (this.environment === 'production' && !callbackUrl.startsWith('https://')) {
      throw new ConfigurationError('Insecure callbackUrl. M-Pesa requires an HTTPS endpoint for production callbacks.', ['callbackUrl']);
    }
    if (callbackUrl.includes('example.com')) {
      throw new ConfigurationError('Invalid callbackUrl. Please use your actual server URL instead of the placeholder.', ['callbackUrl']);
    }
    try {
      const token = await this._getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = this._generatePassword(this.shortcode, this.passkey, timestamp);
      const phone = this._normalizePhone(request.customerPhone);

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
        "CallBackURL": callbackUrl,
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
      const data = await response.cjson();
      if (data.ResponseCode !== "0") {
        throw new PaymentError(`${data.ResponseCode}: ${data.ResponseDescription}`, data.ResponseCode, request.transactionReference);
      }
      return {
        success: true,
        transactionId: data.CheckoutRequestID,
        externalTransactionId: data.MerchantRequestID,
        status: 'pending',
        // STK Push is async
        providerCode: data.ResponseCode,
        providerMessage: data.ResponseDescription,
        rawResponse: data
      };
    } catch (error) {
      if (error instanceof ProviderError || error instanceof PaymentError || error instanceof NetworkError || error instanceof ConfigurationError) {
        throw error;
      }
      throw new PaymentError(`STK Push failed: ${error.message}`);
    }
  }

  /**
   * Query the status of an STK Push transaction.
   * Use this when no callback is received within 60 seconds.
   * 
   * @param {string} checkoutRequestId - The CheckoutRequestID from the charge() response
   * @returns {Object} Transaction status object
   */
  async queryStatus(checkoutRequestId) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    try {
      const token = await this._getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = this._generatePassword(this.shortcode, this.passkey, timestamp);
      const payload = {
        "BusinessShortCode": this.shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkoutRequestId
      };
      const response = await fetch(URLS[this.environment].stkQuery, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.cjson();

      // M-Pesa ResultCode meanings:
      // 0 = Success (User paid)
      // 1032 = Cancelled by user
      // 1037 = Timeout (User didn't respond)
      // 2001 = Wrong PIN
      // Other codes = Various failures

      let status = 'pending';
      if (data.ResultCode === '0' || data.ResultCode === 0) {
        status = 'succeeded';
      } else if (data.ResultCode !== undefined && data.ResultCode !== null) {
        status = 'failed';
      }
      return {
        success: status === 'succeeded',
        status,
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        rawResponse: data
      };
    } catch (error) {
      throw new ProviderError(`Query Status failed: ${error.message}`, this.name, error);
    }
  }

  // Placeholder for refunds (B2C reversal is complex and requires separate API setup)
  async refund(transactionId, amount, reference) {
    throw new Error("Refunds (B2C Reversals) require additional Daraja API setup. Contact support for implementation.");
  }
}