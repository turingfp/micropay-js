/// Micropay Flutter SDK
///
/// Official SDK for accepting M-Pesa payments in Flutter apps.
///
/// ## Quick Start
///
/// ```dart
/// import 'package:micropay/micropay.dart';
///
/// // Initialize
/// final micropay = Micropay(publicKey: 'pk_test_...');
///
/// // Create and confirm payment
/// final intent = await micropay.createPaymentIntent(
///   amount: 500,
///   phoneNumber: '254712345678',
///   description: 'Premium Upgrade',
/// );
///
/// await micropay.confirmPaymentIntent(intent.id, intent.clientSecret);
/// ```
library micropay;

export 'src/micropay_client.dart';
export 'src/models/payment_intent.dart';
export 'src/models/micropay_error.dart';
export 'src/widgets/payment_sheet.dart';
export 'src/widgets/micropay_button.dart';
export 'src/widgets/mpesa_phone_field.dart';
