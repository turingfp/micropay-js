# Micropay Flutter SDK

Official Flutter SDK for accepting M-Pesa payments in your mobile app.

[![pub package](https://img.shields.io/pub/v/micropaysdk.svg)](https://pub.dev/packages/micropaysdk)

## Features

- **Quick Integration** - Drop-in UI components for payment flows
- **Native Feel** - Platform-adaptive widgets that match iOS and Android
- **Secure** - PCI-compliant, credentials never touch client code
- **Multi-Country** - Supports Kenya, Tanzania, Uganda, Rwanda, Malawi
- **Customizable** - Theming support for brand consistency

## Installation

Add `micropaysdk` to your `pubspec.yaml`:

```yaml
dependencies:
  micropaysdk: ^0.1.0
```

Then run:

```bash
flutter pub get
```

## Quick Start

### 1. Initialize the Client

```dart
import 'package:micropaysdk/micropaysdk.dart';

final micropay = Micropay(
  publicKey: 'pk_test_your_public_key',
  debug: true,
);
```

### 2. Show the Payment Sheet

```dart
final result = await PaymentSheet.show(
  context: context,
  micropay: micropay,
  amount: 50000, // KES 500.00 (amounts in cents)
  currency: 'KES',
  description: 'Premium Subscription',
  onStatusChange: (status) {
    print('Payment status: $status');
  },
);

if (result != null && result.isSucceeded) {
  print('Receipt: ${result.providerReference}');
}
```

## Widgets

### MicropayButton

A styled button for initiating payments:

```dart
MicropayButton(
  onPressed: () => initiatePayment(),
  amount: 50000,
  currency: 'KES',
  size: MicropayButtonSize.large,
  style: MicropayButtonStyle.primary,
)
```

| Prop | Type | Description |
|------|------|-------------|
| `onPressed` | `VoidCallback?` | Callback when button is pressed |
| `amount` | `int?` | Amount in smallest currency unit |
| `currency` | `String` | Currency code (default: 'KES') |
| `label` | `String?` | Custom button label |
| `isLoading` | `bool` | Show loading indicator |
| `isDisabled` | `bool` | Disable the button |

### MpesaPhoneField

Phone number input with country selector:

```dart
MpesaPhoneField(
  controller: phoneController,
  initialCountry: MpesaCountry.kenya,
  labelText: 'M-Pesa Phone Number',
  onChanged: (fullNumber) {
    print('Full number: $fullNumber');
  },
)
```

**Supported Countries:**

| Country | Dial Code |
|---------|-----------|
| Kenya | +254 |
| Tanzania | +255 |
| Uganda | +256 |
| Rwanda | +250 |
| Malawi | +265 |

### PaymentSheet

Full-screen payment flow:

```dart
final result = await PaymentSheet.show(
  context: context,
  micropay: micropay,
  amount: 50000,
  currency: 'KES',
  description: 'Order #12345',
  metadata: {'orderId': '12345'},
);
```

## API Reference

### Micropay Client

```dart
final micropay = Micropay(
  publicKey: 'pk_test_...',
  timeout: Duration(seconds: 30),
  debug: false,
);
```

### createPaymentIntent

```dart
final intent = await micropay.createPaymentIntent(
  amount: 50000,
  phoneNumber: '254712345678',
  currency: 'KES',
  description: 'Premium upgrade',
  idempotencyKey: 'unique-request-id',
);
```

### confirmPaymentIntent

```dart
final confirmed = await micropay.confirmPaymentIntent(
  intent.id,
  intent.clientSecret!,
);
```

### pollPaymentStatus

```dart
final result = await micropay.pollPaymentStatus(
  'pi_xxx',
  pollInterval: Duration(seconds: 2),
  maxAttempts: 60,
  onStatusChange: (status) => print('Status: $status'),
);
```

## PaymentIntentStatus

| Status | Description |
|--------|-------------|
| `requiresConfirmation` | Awaiting confirmation |
| `processing` | STK Push sent, awaiting user |
| `succeeded` | Payment completed |
| `failed` | Payment failed |
| `cancelled` | Payment cancelled |

## Error Handling

```dart
try {
  final intent = await micropay.createPaymentIntent(...);
} on MicropayError catch (e) {
  print('Error code: ${e.code}');
  print('Message: ${e.message}');
  
  if (e.isRetryable) {
    // Safe to retry
  }
}
```

## Testing

Use test API keys (`pk_test_...`) during development:

```dart
final micropay = Micropay(
  publicKey: 'pk_test_your_test_key',
  debug: true,
);

// Test phone numbers:
// 254700000001 - Always succeeds
// 254700000002 - Always fails
// 254700000003 - Delays 30s then succeeds
```

## Production Checklist

- Replace test key with live key (`pk_live_...`)
- Set `debug: false`
- Implement proper error handling
- Add retry logic for network failures
- Test on real devices with real M-Pesa accounts
- Configure webhook endpoints for server-side verification

## Minimum Requirements

- Flutter >= 3.10.0
- Dart >= 3.0.0
- iOS >= 12.0
- Android >= API 21 (Lollipop)

## License

MIT
