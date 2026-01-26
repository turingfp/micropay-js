/**
 * PaymentGateway - Unified interface for micropayment operations
 * This is the main entry point for developers to integrate micropayments
 */

import { MpesaProvider } from './providers/MpesaProvider.js';
import { TransactionManager } from './TransactionManager.js';
import { PaymentRequest } from './models/PaymentRequest.js';
import { PaymentResult } from './models/PaymentResult.js';
import { TransactionStatus } from './models/Transaction.js';
import { ConfigurationError, ProviderError } from './utils/errors.js';

/**
 * Available payment providers
 */
const PROVIDERS = {
    mpesa: MpesaProvider,
    // Future: jazzcash: JazzcashProvider,
};

/**
 * PaymentGateway - Unified micropayment interface
 * 
 * @example
 * const gateway = new PaymentGateway({
 *   provider: 'mpesa',
 *   credentials: { apiKey, publicKey, serviceProviderCode },
 *   environment: 'sandbox'
 * });
 * 
 * const result = await gateway.charge({
 *   customerPhone: '841234567',
 *   amount: 50,
 *   reference: 'premium_unlock',
 *   description: 'Premium feature unlock'
 * });
 */
export class PaymentGateway {
    /**
     * Create a new PaymentGateway
     * @param {Object} config - Gateway configuration
     * @param {string} config.provider - Provider name ('mpesa')
     * @param {Object} config.credentials - Provider credentials
     * @param {string} config.environment - 'sandbox' or 'production'
     * @param {Object} config.retryConfig - Transaction retry configuration
     */
    constructor(config = {}) {
        this._validateConfig(config);

        this.providerName = config.provider || 'mpesa';
        this.environment = config.environment || 'sandbox';
        this.isInitialized = false;

        // Initialize provider
        const ProviderClass = PROVIDERS[this.providerName];
        if (!ProviderClass) {
            throw new ConfigurationError(`Unknown provider: ${this.providerName}`);
        }

        this.provider = new ProviderClass({
            credentials: config.credentials,
            environment: this.environment,
            timeout: config.timeout || 30,
        });

        // Initialize transaction manager
        this.transactionManager = new TransactionManager(config.retryConfig || {});

        // Event listeners
        this._eventListeners = new Map();
    }

    /**
     * Validate gateway configuration
     * @private
     */
    _validateConfig(config) {
        if (!config.credentials) {
            throw new ConfigurationError('credentials are required');
        }
    }

    /**
     * Initialize the gateway (lazy initialization)
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        await this.provider.initialize();
        this.isInitialized = true;
    }

    /**
     * Charge a customer (C2B payment)
     * This is the main method for collecting micropayments from users
     * 
     * @param {Object} requestData - Payment request data
     * @param {string} requestData.customerPhone - Customer's phone number
     * @param {number} requestData.amount - Amount to charge
     * @param {string} requestData.currency - Currency code (default: MZN)
     * @param {string} requestData.reference - Unique reference for this payment
     * @param {string} requestData.description - Human-readable description
     * @param {Object} requestData.metadata - Additional metadata
     * @returns {Promise<PaymentResult>}
     * 
     * @example
     * const result = await gateway.charge({
     *   customerPhone: '841234567',
     *   amount: 100,
     *   reference: 'premium_feature_001',
     *   description: 'Unlock premium feature'
     * });
     * 
     * if (result.success) {
     *   console.log('Payment successful:', result.transactionId);
     * }
     */
    async charge(requestData) {
        await this.initialize();

        // Create and validate payment request
        const request = new PaymentRequest(requestData);
        request.validate();

        // Create transaction for tracking
        const transaction = this.transactionManager.createTransaction(
            request,
            this.providerName
        );

        try {
            // Execute charge with retry support
            const result = await this.transactionManager.executeWithRetry(
                () => this.provider.charge(request),
                transaction
            );

            // Update transaction with result
            this.transactionManager.updateWithResult(transaction.id, result);

            // Emit success event
            this._emit('payment:success', { transaction, result });

            return result;
        } catch (error) {
            // Create failure result
            const failureResult = PaymentResult.fromError(error, request);
            this.transactionManager.updateWithResult(transaction.id, failureResult);

            // Emit failure event
            this._emit('payment:failed', { transaction, error });

            throw new ProviderError(
                `Payment failed: ${error.message}`,
                this.providerName,
                error
            );
        }
    }

    /**
     * Send money to a customer (B2C payment / payout)
     * 
     * @param {Object} requestData - Payout request data
     * @param {string} requestData.recipientPhone - Recipient's phone number
     * @param {number} requestData.amount - Amount to send
     * @param {string} requestData.reference - Unique reference
     * @returns {Promise<PaymentResult>}
     */
    async payout(requestData) {
        await this.initialize();

        try {
            const result = await this.provider.payout(requestData);
            this._emit('payout:success', { result });
            return result;
        } catch (error) {
            this._emit('payout:failed', { error });
            throw error;
        }
    }

    /**
     * Refund a previous transaction
     * 
     * @param {string} transactionId - Transaction ID to refund
     * @param {number} amount - Amount to refund
     * @param {string} reference - Reference for the refund
     * @returns {Promise<PaymentResult>}
     */
    async refund(transactionId, amount, reference) {
        await this.initialize();

        try {
            const result = await this.provider.refund(transactionId, amount, reference);
            this._emit('refund:success', { transactionId, result });
            return result;
        } catch (error) {
            this._emit('refund:failed', { transactionId, error });
            throw error;
        }
    }

    /**
     * Query transaction status
     * 
     * @param {string} queryReference - Reference to query
     * @param {string} thirdPartyReference - Third party reference
     * @returns {Promise<Object>}
     */
    async queryStatus(queryReference, thirdPartyReference) {
        await this.initialize();
        return this.provider.queryStatus(queryReference, thirdPartyReference);
    }

    /**
     * Get transaction by ID
     * @param {string} transactionId - Transaction ID
     * @returns {Transaction|null}
     */
    getTransaction(transactionId) {
        return this.transactionManager.getTransaction(transactionId);
    }

    /**
     * Get all pending transactions
     * @returns {Transaction[]}
     */
    getPendingTransactions() {
        return this.transactionManager.getTransactionsByStatus(TransactionStatus.PENDING);
    }

    /**
     * Subscribe to gateway events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * gateway.on('payment:success', ({ transaction, result }) => {
     *   console.log('Payment completed:', result.transactionId);
     * });
     */
    on(event, callback) {
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, []);
        }
        this._eventListeners.get(event).push(callback);

        return () => {
            const callbacks = this._eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Emit event to listeners
     * @private
     */
    _emit(event, data) {
        const callbacks = this._eventListeners.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    }

    /**
     * Get the underlying transaction manager
     * @returns {TransactionManager}
     */
    getTransactionManager() {
        return this.transactionManager;
    }

    /**
     * Get gateway info
     * @returns {Object}
     */
    getInfo() {
        return {
            provider: this.providerName,
            environment: this.environment,
            isInitialized: this.isInitialized,
        };
    }
}
