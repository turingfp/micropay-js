# Micropay Flutter SDK

Official Flutter SDK for accepting M-Pesa payments in your mobile app.

[![pub package](https://img.shields.io/pub/v/micropay.svg)](https://pub.dev/packages/micropay)
[![style: flutter_lints](https://img.shields.io/badge/style-flutter__lints-blue)](https://pub.dev/packages/flutter_lints)

## Features

- 🚀 **Quick Integration** — Drop-in UI components for payment flows
- 📱 **Native Feel** — Platform-adaptive widgets that match iOS and Android
- 🔒 **Secure** — PCI-compliant, credentials never touch client code
- 🌍 **Multi-Country** — Supports Kenya, Tanzania, Uganda, Rwanda, Malawi
- 🎨 **Customizable** — Theming support for brand consistency

## Installation

Add `micropay` to your `pubspec.yaml`:

```yaml
dependencies:
  micropay: ^0.1.0
```

Then run:

```bash
flutter pub get
```

## Quick Start

### 1. Initialize the Client

```dart
import 'package:micropay/micropay.dart';

final micropay = Micropay(
  publicKey: 'pk_test_your_public_key',
  debug: true, // Enable for development
);
```

### 2. Show the Payment Sheet

The easiest way to accept payments:

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
  // Payment successful! 🎉
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

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onPressed` | `VoidCallback?` | Callback when button is pressed |
| `amount` | `int?` | Amount in smallest currency unit |
| `currency` | `String` | Currency code (default: 'KES') |
| `label` | `String?` | Custom button label |
| `isLoading` | `bool` | Show loading indicator |
| `isDisabled` | `bool` | Disable the button |
| `size` | `MicropayButtonSize` | Button size variant |
| `style` | `MicropayButtonStyle` | Visual style variant |

### MpesaPhoneField

Phone number input with country selector:

```dart
MpesaPhoneField(
  controller: phoneController,
  initialCountry: MpesaCountry.kenya,
  labelText: 'M-Pesa Phone Number',
  onChanged: (fullNumber) {
    print('Full number: $fullNumber'); // e.g., "254712345678"
  },
  onCountryChanged: (country) {
    print('Selected: ${country.name}');
  },
)
```

**Supported Countries:**

| Country | Dial Code | Flag |
|---------|-----------|------|
| Kenya | +254 | 🇰🇪 |
| Tanzania | +255 | 🇹🇿 |
| Uganda | +256 | 🇺🇬 |
| Rwanda | +250 | 🇷🇼 |
| Malawi | +265 | 🇲🇼 |

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
  theme: PaymentSheetTheme.defaults(context),
);
```

## API Reference

### Micropay Client

```dart
final micropay = Micropay(
  publicKey: 'pk_test_...',
  baseUrl: 'https://api.micropay.io/v1', // optional
  timeout: Duration(seconds: 30), // optional
  debug: false, // optional
);
```

#### createPaymentIntent

Creates a new payment intent:

```dart
final intent = await micropay.createPaymentIntent(
  amount: 50000,
  phoneNumber: '254712345678',
  currency: 'KES',
  description: 'Premium upgrade',
  metadata: {'userId': 'user_123'},
  idempotencyKey: 'unique-request-id',
);
```

#### confirmPaymentIntent

Confirms a payment intent (triggers STK Push):

```dart
final confirmed = await micropay.confirmPaymentIntent(
  intent.id,
  intent.clientSecret!,
);
```

#### getPaymentIntent

Retrieves a payment intent by ID:

```dart
final intent = await micropay.getPaymentIntent('pi_xxx');
```

#### pollPaymentStatus

Polls until payment completes:

```dart
final result = await micropay.pollPaymentStatus(
  'pi_xxx',
  pollInterval: Duration(seconds: 2),
  maxAttempts: 60,
  onStatusChange: (status) => print('Status: $status'),
);
```

### PaymentIntent

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String` | Unique identifier |
| `amount` | `int` | Amount in smallest unit |
| `currency` | `String` | Currency code |
| `status` | `PaymentIntentStatus` | Current status |
| `clientSecret` | `String?` | Client secret for confirmation |
| `phoneNumber` | `String?` | M-Pesa phone number |
| `description` | `String?` | Payment description |
| `metadata` | `Map<String, dynamic>?` | Custom metadata |
| `providerReference` | `String?` | M-Pesa receipt number |
| `errorMessage` | `String?` | Error message if failed |

### PaymentIntentStatus

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

## Custom Theming

Apply your brand colors to the PaymentSheet:

```dart
PaymentSheet.show(
  context: context,
  micropay: micropay,
  amount: 50000,
  theme: PaymentSheetTheme(
    backgroundColor: Colors.white,
    primaryColor: Color(0xFF00A651),
    successColor: Color(0xFF00C853),
    errorColor: Color(0xFFEF5350),
    // ... more customization
  ),
);
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

- [ ] Replace test key with live key (`pk_live_...`)
- [ ] Set `debug: false`
- [ ] Implement proper error handling
- [ ] Add retry logic for network failures
- [ ] Test on real devices with real M-Pesa accounts
- [ ] Configure webhook endpoints for server-side verification
- [ ] Enable ProGuard/R8 rules for Android release builds

## Minimum Requirements

- Flutter >= 3.10.0
- Dart >= 3.0.0
- iOS >= 12.0
- Android >= API 21 (Lollipop)

## Support

- 📖 [Documentation](https://docs.micropay.io/flutter)
- 💬 [Discord Community](https://discord.gg/micropay)
- 🐛 [Report Issues](https://github.com/turingfp/micropay/issues)
- 📧 [Email Support](mailto:support@micropay.io)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for African developers by Micropay
