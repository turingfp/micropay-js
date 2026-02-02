/**
 * Micropay React Native SDK
 * 
 * Provides a native payment experience for React Native apps.
 * 
 * Usage:
 * ```javascript
 * import { MicropayProvider, usePayment, PaymentSheet } from '@micropaysdk/react-native';
 * 
 * // Wrap your app
 * <MicropayProvider publicKey="pk_test_...">
 *   <App />
 * </MicropayProvider>
 * 
 * // In your component
 * const { createPaymentIntent, confirmPayment } = usePayment();
 * ```
 */

export { MicropayProvider, useMicropay } from './MicropayProvider';
export { usePayment } from './hooks/usePayment';
export { PaymentSheet } from './components/PaymentSheet';
export { MicropayButton } from './components/MicropayButton';
export { MpesaPhoneInput } from './components/MpesaPhoneInput';
export { MicropayClient } from './MicropayClient';
