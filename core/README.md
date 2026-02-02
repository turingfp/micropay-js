# @micropaysdk/core

The core JavaScript SDK for Micropay. Enable M-Pesa payments in your application with a few lines of code.

## Installation

```bash
npm install @micropaysdk/core
```

## Quick Start

```javascript
import { createMicropay } from '@micropaysdk/core';

const micropay = createMicropay({
  publicKey: 'pk_test_...',
});

const session = micropay.createSession({
  amount: 100,
  description: 'Coffee Payment',
  customerPhone: '254712345678'
});

session.on('success', (tx) => {
  console.log('Payment successful!', tx);
});
```

## API Usage

### Create a Payment Intent

```javascript
const intent = await micropay.createPaymentIntent({
  amount: 500,
  currency: 'KES',
  customer_phone: '254712345678',
  description: 'Order #123'
});
```

### Confirm Payment

```javascript
const confirmed = await micropay.confirmPaymentIntent(intent.id, {
  payment_method: 'mpesa',
  phone_number: '254712345678'
});
```

### Check Status

```javascript
const status = await micropay.getPaymentIntent(intent.id);
console.log(status.status); // 'succeeded' | 'processing' | 'failed'
```

## Features

- M-Pesa STK Push support
- Automatic status polling
- Webhook handling (via Micropay backend)
- Sandbox & Production environments
- TypeScript types included

## Configuration

| Option | Type | Description |
|--------|------|-------------|
| `publicKey` | string | Your Micropay publishable key |
| `environment` | 'sandbox' \| 'production' | API environment (default: 'sandbox') |

## License

MIT
