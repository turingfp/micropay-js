/**
 * TransactionManager - Manages transaction lifecycle with retry support
 */

import { Transaction, TransactionStatus } from './models/Transaction.js';
import { TransactionError } from './utils/errors.js';

/**
 * Default configuration for TransactionManager
 */
const DEFAULT_CONFIG = {
    maxRetries: 3,
    retryDelayMs: 1000,
    retryBackoffMultiplier: 2,
    transactionTimeoutMs: 30000,
};

/**
 * TransactionManager handles transaction lifecycle, retries, and status tracking
 */
export class TransactionManager {
    /**
     * Create a new TransactionManager
     * @param {Object} config - Configuration options
     * @param {number} config.maxRetries - Maximum retry attempts (default: 3)
     * @param {number} config.retryDelayMs - Initial retry delay in ms (default: 1000)
     * @param {number} config.retryBackoffMultiplier - Exponential backoff multiplier (default: 2)
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.transactions = new Map(); // In-memory store (stateless by default)
        this.listeners = new Map();
    }

    /**
     * Create a new transaction
     * @param {PaymentRequest} request - Payment request
     * @param {string} provider - Provider name
     * @returns {Transaction}
     */
    createTransaction(request, provider) {
        const transaction = new Transaction({
            reference: request.reference,
            amount: request.amount,
            currency: request.currency,
            customerPhone: request.customerPhone,
            description: request.description,
            provider: provider,
            metadata: request.metadata,
        });

        this.transactions.set(transaction.id, transaction);
        this._emit('transaction:created', transaction);

        return transaction;
    }

    /**
     * Get transaction by ID
     * @param {string} transactionId - Transaction ID
     * @returns {Transaction|null}
     */
    getTransaction(transactionId) {
        return this.transactions.get(transactionId) || null;
    }

    /**
     * Get transaction by external ID (provider's transaction ID)
     * @param {string} externalId - External transaction ID
     * @returns {Transaction|null}
     */
    getTransactionByExternalId(externalId) {
        for (const transaction of this.transactions.values()) {
            if (transaction.externalId === externalId) {
                return transaction;
            }
        }
        return null;
    }

    /**
     * Update transaction with result
     * @param {string} transactionId - Transaction ID
     * @param {PaymentResult} result - Payment result
     */
    updateWithResult(transactionId, result) {
        const transaction = this.getTransaction(transactionId);
        if (!transaction) {
            throw new TransactionError(`Transaction not found: ${transactionId}`, transactionId);
        }

        transaction.externalId = result.externalTransactionId;
        transaction.conversationId = result.conversationId;

        if (result.success) {
            transaction.updateStatus(TransactionStatus.COMPLETED);
            this._emit('transaction:completed', transaction);
        } else {
            transaction.updateStatus(TransactionStatus.FAILED, result.error);
            this._emit('transaction:failed', transaction);
        }

        return transaction;
    }

    /**
     * Mark transaction as processing
     * @param {string} transactionId - Transaction ID
     */
    markProcessing(transactionId) {
        const transaction = this.getTransaction(transactionId);
        if (transaction) {
            transaction.updateStatus(TransactionStatus.PROCESSING);
            this._emit('transaction:processing', transaction);
        }
    }

    /**
     * Execute with retry logic
     * @param {Function} operation - Async operation to execute
     * @param {Transaction} transaction - Transaction being processed
     * @returns {Promise<*>}
     */
    async executeWithRetry(operation, transaction) {
        let lastError;
        let delay = this.config.retryDelayMs;

        while (transaction.retryCount <= this.config.maxRetries) {
            try {
                this.markProcessing(transaction.id);
                return await operation();
            } catch (error) {
                lastError = error;
                transaction.updateStatus(TransactionStatus.FAILED, error);

                if (transaction.canRetry(this.config.maxRetries)) {
                    transaction.retry();
                    this._emit('transaction:retry', transaction);

                    // Wait with exponential backoff
                    await this._sleep(delay);
                    delay *= this.config.retryBackoffMultiplier;
                } else {
                    break;
                }
            }
        }

        throw lastError;
    }

    /**
     * Subscribe to transaction events
     * @param {string} event - Event name (transaction:created, transaction:completed, etc.)
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Get all transactions (for debugging/admin)
     * @returns {Transaction[]}
     */
    getAllTransactions() {
        return Array.from(this.transactions.values());
    }

    /**
     * Get transactions by status
     * @param {string} status - Transaction status
     * @returns {Transaction[]}
     */
    getTransactionsByStatus(status) {
        return this.getAllTransactions().filter(t => t.status === status);
    }

    /**
     * Clear all transactions (for testing)
     */
    clear() {
        this.transactions.clear();
    }

    /**
     * Emit event to listeners
     * @private
     */
    _emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    }

    /**
     * Sleep utility for retry delays
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
