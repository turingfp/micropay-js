# @micropaysdk/react

React components and hooks for Micropay. The easiest way to accept M-Pesa in your React app.

## Installation

```bash
npm install @micropaysdk/react @micropaysdk/core
```

## Quick Start

```jsx
import { MicropayProvider, PaymentPopup, usePaymentPopup } from '@micropaysdk/react';
import '@micropaysdk/react/styles.css';

function App() {
  return (
    <MicropayProvider 
      publicKey="pk_test_..."
      theme="light"
    >
      <PaymentButton />
      <PaymentPopup />
    </MicropayProvider>
  );
}

function PaymentButton() {
  const { openPopup } = usePaymentPopup();

  return (
    <button onClick={() => openPopup({ 
      amount: 100, 
      description: 'Premium Coffee',
    })}>
      Pay with M-Pesa
    </button>
  );
}
```

## Components

### MicropayProvider

Wraps your app to provide Micropay context.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `publicKey` | string | Yes | Your Micropay publishable key |
| `theme` | 'light' \| 'dark' | No | UI theme (default: 'light') |
| `environment` | 'sandbox' \| 'production' | No | API environment |

### PaymentPopup

Pre-built payment modal. Must be placed inside `MicropayProvider`.

### PaymentButton

Styled button component for triggering payments.

## Hooks

### usePaymentPopup()

Control the payment popup programmatically.

```jsx
const { openPopup, closePopup, isOpen } = usePaymentPopup();
```

### usePurchase()

Handle the full payment flow.

```jsx
const { purchase, isProcessing, error } = usePurchase();
```

### useMicropay()

Access the Micropay client directly.

```jsx
const { client, publicKey, environment } = useMicropay();
```

## Features

- **Bottom-sheet pattern** - Mobile-first design for a native feel
- **Step-by-step guidance** - Clear states for entering number, processing, and confirmation
- **Themeable** - Light and dark themes with CSS customization
- **Multi-region** - Built-in support for East African countries

## License

MIT
