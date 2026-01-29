# Getting Started with Micropay

This guide will get you accepting mobile money payments in under 5 minutes.

## Prerequisites

- Node.js 16+
- React 17+ (for React SDK)
- mPesa developer credentials ([Get them here](https://developer.safaricom.co.ke))

## Installation

```bash
npm install @micropay/core @micropay/react
```

## 1. Set Up the Provider

Wrap your app with `MicropayProvider`:

```jsx
// App.jsx
import { MicropayProvider, PaymentPopup } from '@micropay/react';
import '@micropay/react/styles.css';

function App() {
  return (
    <MicropayProvider
      publicKey="pk_live_xxx"        // Your public key
      provider="mpesa"               // Payment provider
      environment="sandbox"          // 'sandbox' or 'production'
      currency="MZN"                 // Currency code
      country="MZ"                   // Country code
    >
      <YourApp />
      <PaymentPopup />  {/* Add this once at the root */}
    </MicropayProvider>
  );
}
```

## 2. Create a Payment Button

Use the `usePurchase` hook:

```jsx
import { usePurchase } from '@micropay/react';

function UnlockPremiumButton() {
  const { purchase, isProcessing, error } = usePurchase();

  const handlePurchase = () => {
    purchase({
      amount: 50,
      productId: 'premium_feature',
      description: 'Unlock Premium Features',
      onSuccess: (transaction) => {
        // Transaction completed!
        console.log('Transaction ID:', transaction.id);
        
        // Grant access to user
        grantPremiumAccess();
      },
      onError: (error) => {
        console.error('Payment failed:', error.message);
      },
    });
  };

  return (
    <button onClick={handlePurchase} disabled={isProcessing}>
      {isProcessing ? 'Processing...' : 'Unlock Premium - 50 MZN'}
    </button>
  );
}
```

## 3. That's It!

When users click the button:

1. **Payment popup opens** - User enters their phone number
2. **Push to phone** - User confirms payment on their mPesa app
3. **Callback fires** - Your `onSuccess` is called with transaction details

## Using PaymentButton Component

For even quicker integration, use the pre-built `PaymentButton`:

```jsx
import { PaymentButton } from '@micropay/react';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      
      <PaymentButton
        amount={product.price}
        productId={product.id}
        description={product.name}
        onSuccess={(txn) => unlockProduct(product.id)}
      />
    </div>
  );
}
```

## Next Steps

- [React Guide](./react-guide.md) - Deep dive into React integration
- [Developer Workbench](/dashboard/workbench) - Interactive API Tester
- [Webhooks](./webhooks.md) - Handle payments server-side
- [Testing](./testing.md) - Test in sandbox environment
- [API Reference](./api-reference.md) - Complete API docs
