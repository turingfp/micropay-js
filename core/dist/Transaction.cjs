/**
 * Transaction - Represents a payment transaction
 */

export const TransactionStatus = {
  CREATED: 'created',
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};
export class Transaction {
  constructor(data = {}) {
    this.id = data.id || this._generateId();
    this.externalId = data.externalId || null;
    this.sessionId = data.sessionId || null;
    this.productId = data.productId || null;
    this.amount = data.amount || 0;
    this.currency = data.currency || 'MZN';
    this.description = data.description || '';
    this.customerPhone = data.customerPhone || null;
    this.provider = data.provider || null;
    this.status = data.status || TransactionStatus.CREATED;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    this.error = data.error || null;
  }
  _generateId() {
    return `txn_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
  }
  isPending() {
    return [TransactionStatus.CREATED, TransactionStatus.PENDING, TransactionStatus.PROCESSING].includes(this.status);
  }
  isComplete() {
    return this.status === TransactionStatus.COMPLETED;
  }
  isFailed() {
    return this.status === TransactionStatus.FAILED;
  }
  complete(externalId) {
    this.status = TransactionStatus.COMPLETED;
    this.externalId = externalId;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }
  fail(error) {
    this.status = TransactionStatus.FAILED;
    this.error = typeof error === 'string' ? {
      message: error
    } : error;
    this.updatedAt = new Date();
  }
  toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      sessionId: this.sessionId,
      productId: this.productId,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      customerPhone: this.customerPhone,
      provider: this.provider,
      status: this.status,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      completedAt: this.completedAt?.toISOString() || null,
      error: this.error
    };
  }
  static fromJSON(json) {
    return new Transaction(json);
  }
}