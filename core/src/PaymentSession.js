/**
 * PaymentSession - Manages a payment session lifecycle
 */

import { Transaction, TransactionStatus } from './Transaction.js';
import { SessionError } from './errors.js';

export const SessionStatus = {
    IDLE: 'idle',
    COLLECTING_INFO: 'collecting_info',
    PROCESSING: 'processing',
    AWAITING_CONFIRMATION: 'awaiting_confirmation',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
};

export class PaymentSession {
    constructor(options = {}) {
        this.id = options.id || this._generateId();
        this.status = SessionStatus.IDLE;
        this.productId = options.productId || null;
        this.amount = options.amount || 0;
        this.currency = options.currency || 'KES';
        this.description = options.description || '';
        this.customerPhone = null;
        this.transaction = null;
        this.intentId = options.intentId || null;
        this.clientSecret = options.clientSecret || null;
        this.metadata = options.metadata || {};
        this.callbacks = {
            onStatusChange: options.onStatusChange || (() => { }),
            onSuccess: options.onSuccess || (() => { }),
            onError: options.onError || (() => { }),
            onCancel: options.onCancel || (() => { }),
        };
        this.createdAt = new Date();
        this.expiresAt = new Date(Date.now() + (options.expiryMs || 10 * 60 * 1000)); // 10 min default
    }

    _generateId() {
        return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    }

    _setStatus(status) {
        const oldStatus = this.status;
        this.status = status;
        this.callbacks.onStatusChange({ session: this, oldStatus, newStatus: status });
    }

    isExpired() {
        return new Date() > this.expiresAt;
    }

    isActive() {
        return ![SessionStatus.COMPLETED, SessionStatus.FAILED, SessionStatus.CANCELLED]
            .includes(this.status);
    }

    /**
     * Set customer phone number and prepare for payment
     */
    setCustomerPhone(phone) {
        if (!this.isActive()) {
            throw new SessionError('Session is no longer active', this.id);
        }
        this.customerPhone = phone;
        this._setStatus(SessionStatus.COLLECTING_INFO);
    }

    /**
     * Start processing the payment
     */
    startProcessing(provider) {
        if (!this.customerPhone) {
            throw new SessionError('Customer phone not set', this.id);
        }

        this.transaction = new Transaction({
            sessionId: this.id,
            productId: this.productId,
            amount: this.amount,
            currency: this.currency,
            description: this.description,
            customerPhone: this.customerPhone,
            provider: provider,
            metadata: this.metadata,
        });

        this._setStatus(SessionStatus.PROCESSING);
        return this.transaction;
    }

    /**
     * Mark session as awaiting user confirmation on their phone
     */
    awaitConfirmation() {
        this._setStatus(SessionStatus.AWAITING_CONFIRMATION);
    }

    /**
     * Complete the session with successful payment
     */
    complete(externalTransactionId) {
        if (this.transaction) {
            this.transaction.complete(externalTransactionId);
        }
        this._setStatus(SessionStatus.COMPLETED);
        this.callbacks.onSuccess({
            session: this,
            transaction: this.transaction,
        });
    }

    /**
     * Fail the session
     */
    fail(error) {
        if (this.transaction) {
            this.transaction.fail(error);
        }
        this._setStatus(SessionStatus.FAILED);
        this.callbacks.onError({
            session: this,
            error,
        });
    }

    /**
     * Cancel the session
     */
    cancel() {
        if (this.transaction) {
            this.transaction.status = TransactionStatus.CANCELLED;
        }
        this._setStatus(SessionStatus.CANCELLED);
        this.callbacks.onCancel({ session: this });
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status,
            productId: this.productId,
            amount: this.amount,
            currency: this.currency,
            description: this.description,
            customerPhone: this.customerPhone,
            transaction: this.transaction?.toJSON() || null,
            metadata: this.metadata,
            createdAt: this.createdAt.toISOString(),
            expiresAt: this.expiresAt.toISOString(),
        };
    }
}
