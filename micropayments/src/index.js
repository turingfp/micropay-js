/**
 * @paymentsds/micropayments
 * Modular micropayments gateway for emerging markets
 */

// Core exports
export { PaymentGateway } from './PaymentGateway.js';
export { TransactionManager } from './TransactionManager.js';
export { createCallbackHandler } from './CallbackHandler.js';

// Models
export { PaymentRequest } from './models/PaymentRequest.js';
export { PaymentResult } from './models/PaymentResult.js';
export { Transaction, TransactionStatus } from './models/Transaction.js';

// Providers
export { MpesaProvider } from './providers/MpesaProvider.js';
export { BaseProvider } from './providers/BaseProvider.js';

// Utilities
export { MicropaymentError, ValidationError, ProviderError } from './utils/errors.js';

// Constants
export const PROVIDERS = {
    MPESA: 'mpesa',
    JAZZCASH: 'jazzcash', // Future
};

export const ENVIRONMENTS = {
    SANDBOX: 'sandbox',
    PRODUCTION: 'production',
};
