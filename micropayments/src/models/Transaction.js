/**
 * Transaction model representing a payment transaction
 */

/**
 * Transaction status enum
 */
export const TransactionStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
};

/**
 * Transaction class representing a payment transaction lifecycle
 */
export class Transaction {
    /**
     * Create a new Transaction
     * @param {Object} data - Transaction data
     */
    constructor(data = {}) {
        this.id = data.id || this._generateId();
        this.externalId = data.externalId || null; // Provider transaction ID
        this.conversationId = data.conversationId || null; // mPesa conversation ID
        this.reference = data.reference || null;
        this.amount = data.amount || 0;
        this.currency = data.currency || 'MZN';
        this.customerPhone = data.customerPhone || null;
        this.description = data.description || null;
        this.provider = data.provider || null;
        this.status = data.status || TransactionStatus.PENDING;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.completedAt = data.completedAt || null;
        this.metadata = data.metadata || {};
        this.error = data.error || null;
        this.retryCount = data.retryCount || 0;
    }

    /**
     * Generate a unique transaction ID
     * @private
     */
    _generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return `txn_${timestamp}_${random}`;
    }

    /**
     * Update transaction status
     * @param {string} status - New status
     * @param {Error} error - Optional error if failed
     */
    updateStatus(status, error = null) {
        this.status = status;
        this.updatedAt = new Date();

        if (status === TransactionStatus.COMPLETED) {
            this.completedAt = new Date();
        }

        if (error) {
            this.error = {
                message: error.message,
                code: error.code || 'UNKNOWN',
            };
        }
    }

    /**
     * Check if transaction is in a final state
     * @returns {boolean}
     */
    isFinal() {
        return [
            TransactionStatus.COMPLETED,
            TransactionStatus.FAILED,
            TransactionStatus.REFUNDED,
            TransactionStatus.CANCELLED,
        ].includes(this.status);
    }

    /**
     * Check if transaction can be retried
     * @param {number} maxRetries - Maximum retry attempts
     * @returns {boolean}
     */
    canRetry(maxRetries = 3) {
        return (
            this.status === TransactionStatus.FAILED &&
            this.retryCount < maxRetries
        );
    }

    /**
     * Increment retry count
     */
    retry() {
        this.retryCount += 1;
        this.status = TransactionStatus.PENDING;
        this.updatedAt = new Date();
        this.error = null;
    }

    /**
     * Convert to plain object
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            externalId: this.externalId,
            conversationId: this.conversationId,
            reference: this.reference,
            amount: this.amount,
            currency: this.currency,
            customerPhone: this.customerPhone,
            description: this.description,
            provider: this.provider,
            status: this.status,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            completedAt: this.completedAt ? this.completedAt.toISOString() : null,
            metadata: this.metadata,
            error: this.error,
            retryCount: this.retryCount,
        };
    }

    /**
     * Create Transaction from plain object
     * @param {Object} obj - Plain object
     * @returns {Transaction}
     */
    static fromJSON(obj) {
        return new Transaction({
            ...obj,
            createdAt: obj.createdAt ? new Date(obj.createdAt) : undefined,
            updatedAt: obj.updatedAt ? new Date(obj.updatedAt) : undefined,
            completedAt: obj.completedAt ? new Date(obj.completedAt) : undefined,
        });
    }
}
