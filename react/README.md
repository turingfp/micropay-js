# @micropaysdk/react

React components and hooks for Micropay. The easiest way to accept M-Pesa in your React app.

## Installation

```bash
npm install @micropaysdk/react @micropaysdk/core
```

## Quick Start

```jsx
import { MicropayProvider, useMicropayPopup } from '@micropaysdk/react';

function App() {
  return (
    <MicropayProvider 
      publicKey="pk_test_..."
      theme="light" // or "dark"
    >
      <PaymentButton />
    </MicropayProvider>
  );
}

function PaymentButton() {
  const { openPopup } = useMicropayPopup();

  return (
    <button onClick={() => openPopup({ 
      amount: 100, 
      description: 'Premium Coffee',
      premium: true, // Enable step progress & gradients
      glass: true     // Enable glassmorphism
    })}>
      Pay with M-Pesa
    </button>
  );
}
```

## Features

- **Bottom-sheet pattern**: Mobile-first design for a native feel.
- **Step-by-step guidance**: Clear states for entering number, processing, and prompt confirmation.
- **Premium UI**: Enhanced with glassmorphism, animated gradients, and haptic feedback.
- **Multi-region**: Built-in support for Kenya, Nigeria, and South Africa themes.

## License

MIT
