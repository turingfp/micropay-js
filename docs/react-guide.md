# React Guide

Complete guide to integrating Micropay in React applications.

## Table of Contents

- [Provider Setup](#provider-setup)
- [Hooks](#hooks)
- [Components](#components)
- [Theming](#theming)

---

## Provider Setup

### MicropayProvider

Wrap your app with the provider to enable payments:

```jsx
import { MicropayProvider, PaymentPopup } from '@micropay/react';
import '@micropay/react/styles.css';

function App() {
  return (
    <MicropayProvider
      publicKey="pk_live_xxx"
      provider="mpesa"
      environment="sandbox"
      currency="MZN"
      country="MZ"
      theme="light"           // 'light' | 'dark'
      branding={true}         // Show "Powered by Micropay"
      onError={(err) => console.error(err)}
    >
      <YourApp />
      <PaymentPopup />
    </MicropayProvider>
  );
}
```

### Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `publicKey` | string | required | Your Micropay public key |
| `provider` | string | `'mpesa'` | Payment provider |
| `environment` | string | `'sandbox'` | `'sandbox'` or `'production'` |
| `currency` | string | `'MZN'` | Currency code |
| `country` | string | `'MZ'` | Country code for validation |
| `credentials` | object | - | Direct API credentials (server-side) |
| `theme` | string | `'light'` | Theme: `'light'` or `'dark'` |
| `branding` | boolean | `true` | Show Micropay branding |
| `onError` | function | - | Global error handler |

---

## Hooks

### usePurchase()

The simplest way to trigger payments:

```jsx
const { 
  purchase,      // Function to initiate payment
  isProcessing,  // Boolean - payment in progress
  error,         // Last error (if any)
  lastTransaction, // Last completed transaction
  currency,      // Current currency
  clearError,    // Clear error state
} = usePurchase();

// Usage
purchase({
  amount: 100,
  productId: 'coins_100',
  description: 'Buy 100 Coins',
  metadata: { userId: '123' },
  onSuccess: (txn) => { /* handle success */ },
  onError: (err) => { /* handle error */ },
  onCancel: () => { /* handle cancel */ },
});
```

### useMicropay()

Access the core SDK:

```jsx
const {
  micropay,        // SDK instance
  currentSession,  // Active payment session
  processPayment,  // Process with phone number
  createSession,   // Create new session
  validatePhone,   // Validate phone format
} = useMicropay();
```

### usePaymentPopup()

Control the popup programmatically:

```jsx
const {
  isOpen,  // Boolean - popup visibility
  config,  // Current popup config
  open,    // Open popup with config
  close,   // Close popup
} = usePaymentPopup();

// Open popup manually
open({
  amount: 50,
  productId: 'premium',
  description: 'Premium Access',
});
```

---

## Components

### PaymentPopup

The modal payment UI. Add once at your app root:

```jsx
<PaymentPopup 
  onClose={() => console.log('Popup closed')}
  className="my-custom-class"
/>
```

### PaymentButton

Pre-styled button that triggers payment:

```jsx
<PaymentButton
  amount={100}
  productId="coins"
  description="100 Coins"
  variant="primary"    // 'primary' | 'secondary' | 'outline'
  size="medium"        // 'small' | 'medium' | 'large'
  showAmount={true}    // Show amount in button text
  onSuccess={(txn) => {}}
  onError={(err) => {}}
>
  Buy Coins
</PaymentButton>
```

### PhoneInput

Styled phone input with country code:

```jsx
import { PhoneInput } from '@micropay/react';

<PhoneInput
  value={phone}
  onChange={setPhone}
  country="MZ"
  error={phoneError}
/>
```

---

## Theming

### CSS Variables

Customize the look by overriding CSS variables:

```css
:root {
  --micropay-primary: #10B981;
  --micropay-primary-hover: #059669;
  --micropay-error: #EF4444;
  --micropay-text: #1F2937;
  --micropay-bg: #FFFFFF;
  --micropay-radius: 12px;
}
```

### Dark Mode

Pass `theme="dark"` to the provider:

```jsx
<MicropayProvider theme="dark" {...props}>
```

Or add the `micropay-dark` class to any container.

### Custom Styling

All components have class names you can target:

```css
.micropay-popup { /* Popup container */ }
.micropay-popup__amount { /* Amount display */ }
.micropay-phone-input { /* Phone input */ }
.micropay-btn { /* Buttons */ }
```
