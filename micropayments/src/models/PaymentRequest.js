/**
 * PaymentRequest model for initiating payments
 */

import { validatePaymentRequest } from '../utils/validation.js';

/**
 * PaymentRequest class representing an incoming payment request
 */
export class PaymentRequest {
    /**
     * Create a new PaymentRequest
     * @param {Object} data - Payment request data
     * @param {string} data.customerPhone - Customer's phone number
     * @param {number|string} data.amount - Payment amount
     * @param {string} data.currency - Currency code (default: MZN)
     * @param {string} data.reference - Unique reference for this payment
     * @param {string} data.description - Human-readable description
     * @param {Object} data.metadata - Additional metadata
     */
    constructor(data = {}) {
        this.customerPhone = data.customerPhone;
        this.amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
        this.currency = data.currency || 'MZN';
        this.reference = data.reference;
        this.description = data.description || '';
        this.transactionReference = data.transactionReference || this._generateTransactionRef();
        this.metadata = data.metadata || {};
        this.country = data.country || 'MZ';
    }

    /**
     * Generate a transaction reference
     * @private
     */
    _generateTransactionRef() {
        return `TR${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    /**
     * Validate the payment request
     * @throws {ValidationError}
     */
    validate() {
        validatePaymentRequest(this);
    }

    /**
     * Convert to format expected by mPesa SDK
     * @returns {Object}
     */
    toMpesaFormat() {
        return {
            from: this.customerPhone,
            amount: String(this.amount),
            reference: this.reference,
            transaction: this.transactionReference,
        };
    }

    /**
     * Convert to plain object
     * @returns {Object}
     */
    toJSON() {
        return {
            customerPhone: this.customerPhone,
            amount: this.amount,
            currency: this.currency,
            reference: this.reference,
            description: this.description,
            transactionReference: this.transactionReference,
            metadata: this.metadata,
            country: this.country,
        };
    }

    /**
     * Create PaymentRequest from plain object
     * @param {Object} obj - Plain object
     * @returns {PaymentRequest}
     */
    static from(obj) {
        return new PaymentRequest(obj);
    }
}
