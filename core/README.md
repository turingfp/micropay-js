# @micropaysdk/core

The core Javascript SDK for Micropay. Enable M-Pesa payments in your application with a few lines of code.

## Installation

```bash
npm install @micropaysdk/core
```

## Quickstart (Curl) ⚡

Test the API directly from your terminal:

```bash
# 1. Initiate Charge
curl -X POST https://qlxtpdaphrqlmwvhgazr.supabase.co/functions/v1/micropay-api/charge \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PUBLIC_KEY" \
  -d '{
    "amount": 10,
    "customerPhone": "254700000000",
    "description": "API Test"
  }'

# 2. Check Status
curl -G https://qlxtpdaphrqlmwvhgazr.supabase.co/functions/v1/micropay-api/status \
  -H "x-api-key: YOUR_PUBLIC_KEY" \
  --data-urlencode "id=TRANSACTION_ID_OR_REF"
```

## Quick Start (JS SDK)

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

## Features

- M-Pesa STK Push support
- Dynamic balance tracking
- Automatic webhook handling (via Micropay Engine)
- Sandbox & Production environments

## License

MIT
