# Webhooks Guide

Webhooks are how Micropay notifies your application when an asynchronous payment event occurs (e.g., an STK Push is completed by the user).

## Events

Micropay sends the following events:

| Event Type | Description |
| :--- | :--- |
| `payment_intent.succeeded` | The payment was successfully collected. |
| `payment_intent.failed` | The user cancelled or the payment failed. |
| `payout.succeeded` | A withdrawal request was completed (B2C). |

## Security (Signature Verification)

Every webhook request includes a `X-Micropay-Signature` header. This is an HMAC SHA-256 hash of the request body, signed using your **Webhook Secret**.

You should always verify this signature to ensure the request came from Micropay.

### Node.js Example

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// Use raw body for signature verification
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const secret = 'whsec_...'; // Your Endpoint Secret from Dashboard
  const sig = req.headers['x-micropay-signature'];
  const body = req.body;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(body).digest('hex');

  if (sig !== digest) {
    return res.status(400).send('Invalid signature');
  }

  // Parse JSON
  const event = JSON.parse(body.toString());

  if (event.event_type === 'payment_intent.succeeded') {
    handlePaymentSuccess(event.data);
  }

  res.json({received: true});
});
```

## Idempotency

Webhooks may be delivered more than once (e.g., if your server times out). Always ensure your handler is idempotent by checking if you have already processed the `event.id`.

```javascript
if (await db.processedEvents.find(event.id)) {
  return res.json({received: true});
}
```

## Retry Logic

If your server returns a non-2xx status code, Micropay will retry the webhook delivery with exponential backoff for up to 24 hours.
