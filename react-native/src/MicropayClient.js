/**
 * MicropayClient - API Client for React Native
 * 
 * Handles all HTTP communication with the Micropay API.
 */

const DEFAULT_API_URL = 'https://micropay.dev';

export class MicropayClient {
    constructor(config) {
        this.publicKey = config.publicKey;
        this.secretKey = config.secretKey;
        this.apiUrl = config.apiUrl || DEFAULT_API_URL;
        this.environment = config.environment || 'sandbox';
    }

    /**
     * Get the appropriate API key for the request type
     */
    _getApiKey(requireSecret = false) {
        if (requireSecret) {
            if (!this.secretKey) {
                throw new Error('Secret key required for this operation. Use sk_test_... or sk_live_...');
            }
            return this.secretKey;
        }
        return this.publicKey || this.secretKey;
    }

    /**
     * Make an API request
     */
    async _request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.apiUrl}/${endpoint}`;
        const apiKey = this._getApiKey(options.requireSecret);

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            ...options.headers
        };

        if (options.idempotencyKey) {
            headers['Idempotency-Key'] = options.idempotencyKey;
        }

        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            throw new MicropayError(data.error || 'Request failed', response.status, data);
        }

        return data;
    }

    /**
     * Create a Payment Intent (Server-side operation)
     */
    async createPaymentIntent({ amount, currency = 'KES', customerPhone, description, metadata }) {
        return this._request('v1/payment_intents', {
            method: 'POST',
            requireSecret: true,
            body: {
                amount,
                currency,
                customer_phone: customerPhone,
                description,
                metadata
            }
        });
    }

    /**
     * Confirm a Payment Intent (Client-side operation)
     * Triggers the M-Pesa STK Push to the customer's phone
     */
    async confirmPaymentIntent(intentId, { clientSecret, phoneNumber }) {
        return this._request(`v1/payment_intents/${intentId}/confirm`, {
            method: 'POST',
            requireSecret: false,
            body: {
                client_secret: clientSecret,
                phone_number: phoneNumber
            }
        });
    }

    /**
     * Get Payment Intent status
     */
    async getPaymentIntent(intentId) {
        return this._request(`v1/payment_intents/${intentId}`, {
            method: 'GET',
            requireSecret: false
        });
    }

    /**
     * Poll for payment completion
     * @param {string} intentId - Payment Intent ID
     * @param {object} options - Polling options
     * @returns {Promise<object>} Final payment status
     */
    async pollPaymentStatus(intentId, options = {}) {
        const maxAttempts = options.maxAttempts || 12;
        const intervalMs = options.intervalMs || 5000;
        const onStatusChange = options.onStatusChange || (() => { });

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const intent = await this.getPaymentIntent(intentId);

            onStatusChange(intent.status, attempt);

            if (intent.status === 'succeeded' || intent.status === 'failed') {
                return intent;
            }

            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }

        // Timeout - return last known state
        return this.getPaymentIntent(intentId);
    }
}

/**
 * Custom Error class for Micropay errors
 */
export class MicropayError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.name = 'MicropayError';
        this.statusCode = statusCode;
        this.data = data;
    }
}
