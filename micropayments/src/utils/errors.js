/**
 * Custom error types for micropayments module
 */

export class MicropaymentError extends Error {
    constructor(message, code = 'MICROPAYMENT_ERROR') {
        super(message);
        this.name = 'MicropaymentError';
        this.code = code;
    }
}

export class ValidationError extends MicropaymentError {
    constructor(message, field = null) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.field = field;
    }
}

export class ProviderError extends MicropaymentError {
    constructor(message, provider, originalError = null) {
        super(message, 'PROVIDER_ERROR');
        this.name = 'ProviderError';
        this.provider = provider;
        this.originalError = originalError;
    }
}

export class TransactionError extends MicropaymentError {
    constructor(message, transactionId = null) {
        super(message, 'TRANSACTION_ERROR');
        this.name = 'TransactionError';
        this.transactionId = transactionId;
    }
}

export class ConfigurationError extends MicropaymentError {
    constructor(message) {
        super(message, 'CONFIGURATION_ERROR');
        this.name = 'ConfigurationError';
    }
}
