# API Reference

Complete API documentation for all Micropay packages.

---

## @micropay/core

### createMicropay(config)

Create a Micropay instance:

```javascript
import { createMicropay } from '@micropay/core';

const micropay = createMicropay({
  publicKey: 'pk_live_xxx',
  provider: 'mpesa',
  environment: 'sandbox',
  currency: 'MZN',
  country: 'MZ',
  credentials: {  // For server-side
    apiKey: 'xxx',
    publicKey: 'xxx',
    serviceProviderCode: '123456',
  },
});
```

### micropay.createSession(options)

Create a payment session:

```javascript
const session = micropay.createSession({
  amount: 100,
  productId: 'premium',
  description: 'Premium Access',
  metadata: { userId: '123' },
  onSuccess: (data) => {},
  onError: (error) => {},
  onCancel: () => {},
});
```

Returns: `PaymentSession`

### micropay.processPayment(sessionId, phone)

Process a payment:

```javascript
const result = await micropay.processPayment(session.id, '841234567');
```

Returns:
```javascript
{
  success: boolean,
  session: SessionObject,
  transaction: TransactionObject,
}
```

### micropay.validatePhone(phone)

Validate phone number format:

```javascript
const isValid = micropay.validatePhone('841234567'); // true
```

---

## Types

### PaymentSession

```typescript
{
  id: string;
  status: 'idle' | 'collecting_info' | 'processing' | 
          'awaiting_confirmation' | 'completed' | 'failed' | 'cancelled';
  productId: string;
  amount: number;
  currency: string;
  description: string;
  customerPhone: string | null;
  transaction: Transaction | null;
  metadata: object;
  createdAt: string;
  expiresAt: string;
}
```

### Transaction

```typescript
{
  id: string;
  externalId: string;
  sessionId: string;
  productId: string;
  amount: number;
  currency: string;
  description: string;
  customerPhone: string;
  provider: string;
  status: 'created' | 'pending' | 'processing' | 
          'completed' | 'failed' | 'cancelled' | 'refunded';
  metadata: object;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  error: { message: string; code: string } | null;
}
```

---

## Error Types

```javascript
import { 
  MicropayError,
  ValidationError,
  PaymentError,
  ConfigurationError,
  NetworkError,
} from '@micropay/core';
```

| Error | When |
|-------|------|
| `ValidationError` | Invalid input (phone, amount) |
| `PaymentError` | Payment processing failed |
| `ConfigurationError` | Missing config/credentials |
| `NetworkError` | Network request failed |

---

## Constants

```javascript
import { PROVIDERS, ENVIRONMENTS, CURRENCIES } from '@micropay/core';

PROVIDERS.MPESA      // 'mpesa'
PROVIDERS.JAZZCASH   // 'jazzcash' (future)

ENVIRONMENTS.SANDBOX    // 'sandbox'
ENVIRONMENTS.PRODUCTION // 'production'

CURRENCIES.MZN  // { code: 'MZN', name: 'Mozambican Metical', ... }
CURRENCIES.KES  // { code: 'KES', name: 'Kenyan Shilling', ... }
```
