/**
 * @micropay/react
 * React components and hooks for mobile money payments
 */

// Provider
export { MicropayProvider, useMicropayContext } from './MicropayProvider.jsx';

// Hooks
export { useMicropay } from './hooks/useMicropay.js';
export { usePurchase } from './hooks/usePurchase.js';
export { usePaymentPopup } from './hooks/usePaymentPopup.js';

// Components
export { PaymentPopup } from './components/PaymentPopup.jsx';
export { PaymentButton } from './components/PaymentButton.jsx';
export { PhoneInput } from './components/PhoneInput.jsx';

// Re-export core types
export {
    TransactionStatus,
    SessionStatus,
    PROVIDERS,
    ENVIRONMENTS,
    CURRENCIES,
} from '@micropay/core';
