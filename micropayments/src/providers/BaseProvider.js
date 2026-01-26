/**
 * BaseProvider - Abstract base class for payment providers
 * All provider implementations must extend this class
 */

import { ProviderError } from '../utils/errors.js';

/**
 * Abstract base class for payment providers
 * @abstract
 */
export class BaseProvider {
    /**
     * Create a new provider instance
     * @param {Object} config - Provider configuration
     * @param {Object} config.credentials - Provider credentials
     * @param {string} config.environment - 'sandbox' or 'production'
     */
    constructor(config = {}) {
        if (new.target === BaseProvider) {
            throw new Error('BaseProvider is abstract and cannot be instantiated directly');
        }

        this.name = 'base';
        this.config = config;
        this.environment = config.environment || 'sandbox';
        this.isInitialized = false;
    }

    /**
     * Initialize the provider
     * @abstract
     * @returns {Promise<void>}
     */
    async initialize() {
        throw new ProviderError('initialize() must be implemented by subclass', this.name);
    }

    /**
     * Collect payment from customer (C2B)
     * @abstract
     * @param {PaymentRequest} request - Payment request
     * @returns {Promise<PaymentResult>}
     */
    async charge(request) {
        throw new ProviderError('charge() must be implemented by subclass', this.name);
    }

    /**
     * Send payment to customer (B2C)
     * @abstract
     * @param {Object} request - Payout request
     * @returns {Promise<PaymentResult>}
     */
    async payout(request) {
        throw new ProviderError('payout() must be implemented by subclass', this.name);
    }

    /**
     * Refund a transaction
     * @abstract
     * @param {string} transactionId - Transaction to refund
     * @param {number} amount - Amount to refund (optional, full refund if not specified)
     * @returns {Promise<PaymentResult>}
     */
    async refund(transactionId, amount = null) {
        throw new ProviderError('refund() must be implemented by subclass', this.name);
    }

    /**
     * Query transaction status
     * @abstract
     * @param {string} transactionId - Transaction to query
     * @returns {Promise<Object>}
     */
    async queryStatus(transactionId) {
        throw new ProviderError('queryStatus() must be implemented by subclass', this.name);
    }

    /**
     * Validate provider credentials
     * @abstract
     * @returns {Promise<boolean>}
     */
    async validateCredentials() {
        throw new ProviderError('validateCredentials() must be implemented by subclass', this.name);
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Check if provider is initialized
     * @returns {boolean}
     */
    isReady() {
        return this.isInitialized;
    }
}
