# @micropaysdk/react-native

Official Micropay SDK for React Native. Accept M-Pesa payments in your mobile app with a beautiful, native UI.

## Installation

```bash
npm install @micropaysdk/react-native
```

or

```bash
yarn add @micropaysdk/react-native
```

## Quick Start

### 1. Wrap your app with MicropayProvider

```jsx
import { MicropayProvider } from '@micropaysdk/react-native';

export default function App() {
  return (
    <MicropayProvider publicKey="pk_test_...">
      <YourApp />
    </MicropayProvider>
  );
}
```

### 2. Use the PaymentSheet component

```jsx
import { useState } from 'react';
import { PaymentSheet, MicropayButton } from '@micropaysdk/react-native';

function CheckoutScreen() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <MicropayButton
        amount={500}
        onPress={() => setShowPayment(true)}
      />

      <PaymentSheet
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        amount={500}
        description="Premium Upgrade"
        onSuccess={(intent) => {
          console.log('Payment successful!', intent);
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
        }}
      />
    </>
  );
}
```

### 3. Or use the usePayment hook for custom UI

```jsx
import { usePayment } from '@micropaysdk/react-native';

function CustomPaymentButton({ amount }) {
  const { initiatePayment, status, error } = usePayment();

  const handlePay = async () => {
    try {
      const result = await initiatePayment({
        amount,
        phoneNumber: '254712345678',
        description: 'Game Credits'
      });
      console.log('Success:', result);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <TouchableOpacity onPress={handlePay} disabled={status === 'loading'}>
      <Text>{status === 'loading' ? 'Processing...' : `Pay KES ${amount}`}</Text>
    </TouchableOpacity>
  );
}
```

## Components

### MicropayProvider

Wraps your app to provide Micropay functionality.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `publicKey` | string | Yes | Your Micropay publishable key |
| `environment` | 'sandbox' \| 'production' | No | Defaults to 'sandbox' |

### PaymentSheet

Pre-built bottom sheet modal for payments.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | boolean | Yes | Controls visibility |
| `onClose` | function | Yes | Called when sheet is dismissed |
| `amount` | number | Yes | Payment amount |
| `currency` | string | No | Currency code (default: 'KES') |
| `description` | string | No | Payment description |
| `onSuccess` | function | No | Called with payment intent on success |
| `onError` | function | No | Called with error message on failure |
| `theme` | 'dark' \| 'light' | No | UI theme (default: 'dark') |

### MicropayButton

Styled payment button.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onPress` | function | Yes | Button press handler |
| `amount` | number | No | Amount to display |
| `label` | string | No | Custom button label |
| `variant` | 'primary' \| 'outline' \| 'ghost' | No | Button style |
| `size` | 'small' \| 'medium' \| 'large' | No | Button size |

### MpesaPhoneInput

Phone number input with country selector.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | string | Yes | Phone number value |
| `onChangeText` | function | Yes | Text change handler |
| `defaultCountry` | string | No | Country code (default: 'KE') |

## Hooks

### usePayment()

Returns payment state and methods.

```js
const {
  status,          // 'idle' | 'loading' | 'processing' | 'succeeded' | 'failed'
  error,           // Error message if failed
  paymentIntent,   // Current payment intent object
  isLoading,       // Convenience boolean
  isProcessing,    // Convenience boolean
  isSucceeded,     // Convenience boolean
  isFailed,        // Convenience boolean
  initiatePayment, // Start a new payment
  confirmPayment,  // Confirm an existing intent
  reset            // Reset state for new payment
} = usePayment();
```

### useMicropay()

Access the Micropay client directly.

```js
const { client, publicKey, environment } = useMicropay();
```

## Production Checklist

- Replace test keys with production keys
- Handle payment webhooks on your server
- Test with real M-Pesa sandbox numbers
- Implement proper error handling
- Add analytics/logging for payment events

## License

MIT
