# Micropay SDK

> The Stripe of Mobile Money for Emerging Markets

Micropay is a developer toolkit that enables apps to accept mobile money micropayments (mPesa, Jazzcash) with a beautiful, drop-in payment popup.

## Packages

| Package | Description |
|---------|-------------|
| `@micropaysdk/core` | Core payment logic (framework-agnostic) |
| `@micropaysdk/react` | React components & hooks |

## Quick Start (React)

### 1. Install

```bash
npm install @micropaysdk/core @micropaysdk/react
```

### 2. Add Provider

```jsx
import { MicropayProvider, PaymentPopup } from '@micropaysdk/react';
import '@micropaysdk/react/styles.css';

function App() {
  return (
    <MicropayProvider
      publicKey="pk_live_xxx"
      provider="mpesa"
      environment="sandbox"
    >
      <YourApp />
      <PaymentPopup />
    </MicropayProvider>
  );
}
```

### 3. Trigger Payments

```jsx
import { usePurchase } from '@micropaysdk/react';

function BuyButton() {
  const { purchase, isProcessing } = usePurchase();

  return (
    <button
      onClick={() => purchase({
        amount: 50,
        productId: 'premium',
        description: 'Unlock Premium',
        onSuccess: (txn) => {
          console.log('Paid!', txn.id);
          unlockPremium();
        },
      })}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Buy Premium - 50 MZN'}
    </button>
  );
}
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [React Guide](./docs/react-guide.md)
- [API Reference](./docs/api-reference.md)
- [Webhooks](./docs/webhooks.md)
- [Testing](./docs/testing.md)

## Features

- 🔌 **Plug & Play** - Beautiful payment popup, zero UI work
- 🪝 **React Hooks** - `usePurchase()`, `useMicropay()`, `usePaymentPopup()`
- 🌍 **Multi-Provider** - mPesa today, Jazzcash/Airtel Money coming
- 🎨 **Themeable** - Light/dark themes, CSS customization
- 📱 **Mobile-First** - Designed for emerging market users
- 🔒 **Secure** - Built on proven mPesa SDK infrastructure

## License

MIT
