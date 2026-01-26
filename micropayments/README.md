# @paymentsds/micropayments

> Modular micropayments gateway for emerging markets - mPesa, Jazzcash, and more.

This module provides a developer-friendly interface for integrating mobile money micropayments into your applications. It bridges the gap between mobile wallets (like mPesa) and in-app purchases, enabling monetization from users without traditional bank accounts.

## Installation

```bash
npm install @paymentsds/micropayments
# or
yarn add @paymentsds/micropayments
```

## Quick Start

```javascript
import { PaymentGateway } from '@paymentsds/micropayments';

// Initialize the gateway
const gateway = new PaymentGateway({
  provider: 'mpesa',
  credentials: {
    apiKey: process.env.MPESA_API_KEY,
    publicKey: process.env.MPESA_PUBLIC_KEY,
    serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
  },
  environment: 'sandbox', // or 'production'
});

// Charge a customer
const result = await gateway.charge({
  customerPhone: '841234567',
  amount: 50,
  currency: 'MZN',
  reference: 'premium_feature_001',
  description: 'Unlock premium feature',
});

if (result.success) {
  console.log('Payment successful:', result.transactionId);
}
```

## Features

- **🔌 Modular Provider System** - Start with mPesa, easily add other providers
- **🔄 Automatic Retries** - Exponential backoff retry logic for failed requests
- **📊 Transaction Tracking** - Built-in transaction lifecycle management
- **🎣 Webhook Support** - Express middleware for handling payment callbacks
- **🛡️ Input Validation** - Comprehensive validation for phone numbers and amounts
- **📝 TypeScript-Ready** - Full JSDoc documentation

## API Reference

### PaymentGateway

The main entry point for all payment operations.

#### `charge(request)`

Collect payment from a customer (C2B).

```javascript
const result = await gateway.charge({
  customerPhone: '841234567',
  amount: 100,
  currency: 'MZN',
  reference: 'unique_reference',
  description: 'In-app purchase',
  metadata: { userId: '123' },
});
```

#### `payout(request)`

Send money to a customer (B2C).

```javascript
const result = await gateway.payout({
  recipientPhone: '841234567',
  amount: 50,
  reference: 'cashback_001',
});
```

#### `refund(transactionId, amount, reference)`

Refund a previous transaction.

```javascript
const result = await gateway.refund(
  'original_transaction_id',
  100,
  'refund_001'
);
```

#### `queryStatus(queryReference, thirdPartyReference)`

Check the status of a transaction.

```javascript
const status = await gateway.queryStatus('transaction_id', 'reference');
```

### Event Subscriptions

Listen to payment events:

```javascript
gateway.on('payment:success', ({ transaction, result }) => {
  console.log('Payment completed:', result.transactionId);
});

gateway.on('payment:failed', ({ transaction, error }) => {
  console.log('Payment failed:', error.message);
});
```

### Webhook Handler

Express middleware for handling mPesa callbacks:

```javascript
import express from 'express';
import { createCallbackHandler } from '@paymentsds/micropayments';

const app = express();
app.use(express.json());

app.use('/webhooks/mpesa', createCallbackHandler({
  onPaymentComplete: async (data) => {
    // Payment succeeded - grant the feature
    await unlockFeature(data.reference);
  },
  onPaymentFailed: async (data, error) => {
    // Payment failed - notify user
    await notifyUser(data.reference, error);
  },
}));
```

## Environment Variables

Create a `.env` file:

```env
MPESA_API_KEY=your_api_key
MPESA_PUBLIC_KEY=your_public_key
MPESA_SERVICE_PROVIDER_CODE=your_sp_code

# For reversals (optional)
MPESA_INITIATOR_IDENTIFIER=your_initiator_id
MPESA_SECURITY_CREDENTIAL=your_security_credential
```

## Architecture

```
micropayments/
├── PaymentGateway.js      # Unified payment interface
├── TransactionManager.js  # Transaction lifecycle & retries
├── CallbackHandler.js     # Webhook middleware
├── providers/
│   ├── BaseProvider.js    # Abstract provider interface
│   └── MpesaProvider.js   # mPesa implementation
├── models/
│   ├── PaymentRequest.js
│   ├── PaymentResult.js
│   └── Transaction.js
└── utils/
    ├── validation.js
    └── errors.js
```

## Adding New Providers

To add support for a new payment provider (e.g., Jazzcash):

1. Create a new provider class extending `BaseProvider`
2. Implement all required methods (`charge`, `payout`, `refund`, `queryStatus`)
3. Register the provider in `PaymentGateway.js`

```javascript
// providers/JazzcashProvider.js
import { BaseProvider } from './BaseProvider.js';

export class JazzcashProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.name = 'jazzcash';
  }

  async charge(request) {
    // Jazzcash-specific implementation
  }
  
  // ... other methods
}
```

## Contributing

Contributions are welcome! Please read the contributing guidelines in the main repository.

## License

Apache-2.0 - see LICENSE file.
