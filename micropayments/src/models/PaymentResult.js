/**
 * PaymentResult model representing the outcome of a payment operation
 */

/**
 * PaymentResult class representing the outcome of a payment
 */
export class PaymentResult {
    /**
     * Create a new PaymentResult
     * @param {Object} data - Result data
     */
    constructor(data = {}) {
        this.success = data.success || false;
        this.transactionId = data.transactionId || null;
        this.externalTransactionId = data.externalTransactionId || null;
        this.conversationId = data.conversationId || null;
        this.reference = data.reference || null;
        this.amount = data.amount || 0;
        this.currency = data.currency || 'MZN';
        this.statusCode = data.statusCode || null;
        this.statusMessage = data.statusMessage || null;
        this.provider = data.provider || null;
        this.timestamp = data.timestamp || new Date();
        this.rawResponse = data.rawResponse || null;
        this.error = data.error || null;
    }

    /**
     * Check if payment was successful
     * @returns {boolean}
     */
    isSuccess() {
        return this.success === true;
    }

    /**
     * Get error message if failed
     * @returns {string|null}
     */
    getErrorMessage() {
        if (this.error) {
            return this.error.message || 'Unknown error';
        }
        return null;
    }

    /**
     * Convert to plain object
     * @returns {Object}
     */
    toJSON() {
        return {
            success: this.success,
            transactionId: this.transactionId,
            externalTransactionId: this.externalTransactionId,
            conversationId: this.conversationId,
            reference: this.reference,
            amount: this.amount,
            currency: this.currency,
            statusCode: this.statusCode,
            statusMessage: this.statusMessage,
            provider: this.provider,
            timestamp: this.timestamp.toISOString(),
            error: this.error,
        };
    }

    /**
     * Create a success result from mPesa response
     * @param {Object} mpesaResponse - Raw mPesa API response
     * @param {Object} request - Original payment request
     * @returns {PaymentResult}
     */
    static fromMpesaSuccess(mpesaResponse, request) {
        return new PaymentResult({
            success: true,
            transactionId: mpesaResponse.transaction,
            externalTransactionId: mpesaResponse.transaction,
            conversationId: mpesaResponse.conversation,
            reference: mpesaResponse.reference,
            amount: request.amount,
            currency: request.currency || 'MZN',
            statusCode: mpesaResponse.response?.code,
            statusMessage: mpesaResponse.response?.desc,
            provider: 'mpesa',
            rawResponse: mpesaResponse,
        });
    }

    /**
     * Create a failure result
     * @param {Error} error - Error that occurred
     * @param {Object} request - Original payment request
     * @param {Object} rawResponse - Raw response if available
     * @returns {PaymentResult}
     */
    static fromError(error, request, rawResponse = null) {
        return new PaymentResult({
            success: false,
            reference: request?.reference,
            amount: request?.amount,
            currency: request?.currency || 'MZN',
            provider: request?.provider || 'mpesa',
            error: {
                message: error.message,
                code: error.code || 'UNKNOWN',
                details: error.response?.outputError || null,
            },
            rawResponse,
        });
    }
}
