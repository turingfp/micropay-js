/**
 * Micropay Error Types
 */

export class MicropayError extends Error {
    constructor(message, code = 'MICROPAY_ERROR', details = null) {
        super(message);
        this.name = 'MicropayError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp,
        };
    }
}

export class ValidationError extends MicropayError {
    constructor(message, field = null, value = null) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

export class PaymentError extends MicropayError {
    constructor(message, providerCode = null, transactionId = null) {
        super(message, 'PAYMENT_ERROR');
        this.name = 'PaymentError';
        this.providerCode = providerCode;
        this.transactionId = transactionId;
    }
}

export class ConfigurationError extends MicropayError {
    constructor(message, missingKeys = []) {
        super(message, 'CONFIGURATION_ERROR');
        this.name = 'ConfigurationError';
        this.missingKeys = missingKeys;
    }
}

export class NetworkError extends MicropayError {
    constructor(message, statusCode = null, response = null) {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
        this.statusCode = statusCode;
        this.response = response;
    }
}

export class SessionError extends MicropayError {
    constructor(message, sessionId = null) {
        super(message, 'SESSION_ERROR');
        this.name = 'SessionError';
        this.sessionId = sessionId;
    }
}

export class ProviderError extends MicropayError {
    constructor(message, provider = null, originalError = null) {
        super(message, 'PROVIDER_ERROR');
        this.name = 'ProviderError';
        this.provider = provider;
        this.originalError = originalError;
    }
}
