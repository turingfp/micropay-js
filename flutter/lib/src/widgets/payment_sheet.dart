import 'package:flutter/material.dart';

import '../micropay_client.dart';
import '../models/payment_intent.dart';
import '../models/micropay_error.dart';
import 'micropay_button.dart';
import 'mpesa_phone_field.dart';

/// A pre-built bottom sheet UI for handling M-Pesa payments.
///
/// Example:
/// ```dart
/// final result = await PaymentSheet.show(
///   context: context,
///   micropay: micropayClient,
///   amount: 500,
///   currency: 'KES',
///   description: 'Premium Subscription',
/// );
///
/// if (result != null && result.isSucceeded) {
///   print('Payment successful!');
/// }
/// ```
class PaymentSheet extends StatefulWidget {
  /// The Micropay client instance.
  final Micropay micropay;

  /// The amount to charge in smallest currency unit.
  final int amount;

  /// The currency code (default: 'KES').
  final String currency;

  /// Optional description for the payment.
  final String? description;

  /// Optional metadata to attach to the payment.
  final Map<String, dynamic>? metadata;

  /// Optional idempotency key.
  final String? idempotencyKey;

  /// Called when the payment status changes.
  final ValueChanged<PaymentIntentStatus>? onStatusChange;

  /// Custom theme for the payment sheet.
  final PaymentSheetTheme? theme;

  const PaymentSheet({
    super.key,
    required this.micropay,
    required this.amount,
    this.currency = 'KES',
    this.description,
    this.metadata,
    this.idempotencyKey,
    this.onStatusChange,
    this.theme,
  });

  /// Shows the payment sheet and returns the final payment intent.
  static Future<PaymentIntent?> show({
    required BuildContext context,
    required Micropay micropay,
    required int amount,
    String currency = 'KES',
    String? description,
    Map<String, dynamic>? metadata,
    String? idempotencyKey,
    ValueChanged<PaymentIntentStatus>? onStatusChange,
    PaymentSheetTheme? theme,
  }) async {
    return showModalBottomSheet<PaymentIntent>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => PaymentSheet(
        micropay: micropay,
        amount: amount,
        currency: currency,
        description: description,
        metadata: metadata,
        idempotencyKey: idempotencyKey,
        onStatusChange: onStatusChange,
        theme: theme,
      ),
    );
  }

  @override
  State<PaymentSheet> createState() => _PaymentSheetState();
}

class _PaymentSheetState extends State<PaymentSheet>
    with SingleTickerProviderStateMixin {
  final _phoneController = TextEditingController();
  MpesaCountry _selectedCountry = MpesaCountry.kenya;

  _PaymentStep _currentStep = _PaymentStep.enterPhone;
  PaymentIntent? _paymentIntent;
  String? _errorMessage;
  bool _isLoading = false;

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  String get _fullPhoneNumber {
    final number = _phoneController.text.replaceAll(RegExp(r'[^\d]'), '');
    if (number.isEmpty) return '';
    final cleanNumber = number.startsWith('0') ? number.substring(1) : number;
    return '${_selectedCountry.dialCode.replaceAll('+', '')}$cleanNumber';
  }

  String get _formattedAmount {
    final major = widget.amount / 100;
    return '${widget.currency} ${major.toStringAsFixed(0)}';
  }

  Future<void> _initiatePayment() async {
    if (_fullPhoneNumber.length < 10) {
      setState(() => _errorMessage = 'Please enter a valid phone number');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Create payment intent
      final intent = await widget.micropay.createPaymentIntent(
        amount: widget.amount,
        phoneNumber: _fullPhoneNumber,
        currency: widget.currency,
        description: widget.description,
        metadata: widget.metadata,
        idempotencyKey: widget.idempotencyKey,
      );

      setState(() {
        _paymentIntent = intent;
        _currentStep = _PaymentStep.confirmPayment;
      });

      widget.onStatusChange?.call(intent.status);

      // Confirm payment
      final confirmed = await widget.micropay.confirmPaymentIntent(
        intent.id,
        intent.clientSecret!,
      );

      setState(() {
        _paymentIntent = confirmed;
        _currentStep = _PaymentStep.processing;
      });

      widget.onStatusChange?.call(confirmed.status);

      // Poll for result
      final result = await widget.micropay.pollPaymentStatus(
        intent.id,
        onStatusChange: (status) {
          widget.onStatusChange?.call(status);
        },
      );

      setState(() {
        _paymentIntent = result;
        _currentStep = result.isSucceeded
            ? _PaymentStep.success
            : _PaymentStep.failed;
      });

      widget.onStatusChange?.call(result.status);
    } on MicropayError catch (e) {
      setState(() {
        _errorMessage = e.message;
        _currentStep = _PaymentStep.failed;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'An unexpected error occurred. Please try again.';
        _currentStep = _PaymentStep.failed;
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _reset() {
    setState(() {
      _currentStep = _PaymentStep.enterPhone;
      _paymentIntent = null;
      _errorMessage = null;
      _isLoading = false;
    });
  }

  void _close([PaymentIntent? result]) {
    Navigator.of(context).pop(result);
  }

  @override
  Widget build(BuildContext context) {
    final theme = widget.theme ?? PaymentSheetTheme.defaults(context);

    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        decoration: BoxDecoration(
          color: theme.backgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: theme.handleColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Pay $_formattedAmount',
                          style: theme.titleStyle,
                        ),
                        if (widget.description != null) ...[
                          const SizedBox(height: 4),
                          Text(
                            widget.description!,
                            style: theme.subtitleStyle,
                          ),
                        ],
                      ],
                    ),
                    IconButton(
                      onPressed: () => _close(),
                      icon: Icon(Icons.close, color: theme.iconColor),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              // Content
              Padding(
                padding: const EdgeInsets.all(20),
                child: _buildContent(theme),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(PaymentSheetTheme theme) {
    switch (_currentStep) {
      case _PaymentStep.enterPhone:
        return _buildEnterPhoneStep(theme);
      case _PaymentStep.confirmPayment:
      case _PaymentStep.processing:
        return _buildProcessingStep(theme);
      case _PaymentStep.success:
        return _buildSuccessStep(theme);
      case _PaymentStep.failed:
        return _buildFailedStep(theme);
    }
  }

  Widget _buildEnterPhoneStep(PaymentSheetTheme theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        MpesaPhoneField(
          controller: _phoneController,
          initialCountry: _selectedCountry,
          onCountryChanged: (country) => _selectedCountry = country,
          labelText: 'M-Pesa Phone Number',
          errorText: _errorMessage,
          enabled: !_isLoading,
        ),
        const SizedBox(height: 20),
        MicropayButton(
          onPressed: _isLoading ? null : _initiatePayment,
          isLoading: _isLoading,
          amount: widget.amount,
          currency: widget.currency,
          size: MicropayButtonSize.large,
        ),
        const SizedBox(height: 16),
        Text(
          'You will receive an M-Pesa prompt on your phone',
          textAlign: TextAlign.center,
          style: theme.hintStyle,
        ),
      ],
    );
  }

  Widget _buildProcessingStep(PaymentSheetTheme theme) {
    return Column(
      children: [
        const SizedBox(height: 20),
        SizedBox(
          width: 60,
          height: 60,
          child: CircularProgressIndicator(
            strokeWidth: 3,
            valueColor: AlwaysStoppedAnimation<Color>(theme.primaryColor),
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'Processing Payment...',
          style: theme.titleStyle,
        ),
        const SizedBox(height: 8),
        Text(
          'Please enter your M-Pesa PIN\non your phone to complete the payment',
          textAlign: TextAlign.center,
          style: theme.subtitleStyle,
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildSuccessStep(PaymentSheetTheme theme) {
    return Column(
      children: [
        const SizedBox(height: 20),
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: theme.successColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.check_circle,
            size: 48,
            color: theme.successColor,
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'Payment Successful!',
          style: theme.titleStyle,
        ),
        const SizedBox(height: 8),
        Text(
          _formattedAmount,
          style: theme.amountStyle,
        ),
        if (_paymentIntent?.providerReference != null) ...[
          const SizedBox(height: 8),
          Text(
            'Ref: ${_paymentIntent!.providerReference}',
            style: theme.hintStyle,
          ),
        ],
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: MicropayButton(
            onPressed: () => _close(_paymentIntent),
            label: 'Done',
            style: MicropayButtonStyle.primary,
            size: MicropayButtonSize.large,
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildFailedStep(PaymentSheetTheme theme) {
    return Column(
      children: [
        const SizedBox(height: 20),
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: theme.errorColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.error_outline,
            size: 48,
            color: theme.errorColor,
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'Payment Failed',
          style: theme.titleStyle,
        ),
        const SizedBox(height: 8),
        Text(
          _errorMessage ?? 'The payment could not be completed.',
          textAlign: TextAlign.center,
          style: theme.subtitleStyle,
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: MicropayButton(
                onPressed: () => _close(),
                label: 'Cancel',
                style: MicropayButtonStyle.outline,
                size: MicropayButtonSize.medium,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: MicropayButton(
                onPressed: _reset,
                label: 'Try Again',
                style: MicropayButtonStyle.primary,
                size: MicropayButtonSize.medium,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

enum _PaymentStep {
  enterPhone,
  confirmPayment,
  processing,
  success,
  failed,
}

/// Theme customization for the payment sheet.
class PaymentSheetTheme {
  final Color backgroundColor;
  final Color handleColor;
  final Color primaryColor;
  final Color successColor;
  final Color errorColor;
  final Color iconColor;
  final TextStyle titleStyle;
  final TextStyle subtitleStyle;
  final TextStyle amountStyle;
  final TextStyle hintStyle;

  const PaymentSheetTheme({
    required this.backgroundColor,
    required this.handleColor,
    required this.primaryColor,
    required this.successColor,
    required this.errorColor,
    required this.iconColor,
    required this.titleStyle,
    required this.subtitleStyle,
    required this.amountStyle,
    required this.hintStyle,
  });

  /// Creates default theme based on the current context.
  factory PaymentSheetTheme.defaults(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return PaymentSheetTheme(
      backgroundColor: isDark ? const Color(0xFF1A1A2E) : Colors.white,
      handleColor: isDark ? Colors.grey.shade600 : Colors.grey.shade300,
      primaryColor: const Color(0xFF00A651),
      successColor: const Color(0xFF00C853),
      errorColor: const Color(0xFFEF5350),
      iconColor: theme.colorScheme.onSurface.withOpacity(0.6),
      titleStyle: theme.textTheme.titleLarge!.copyWith(
        fontWeight: FontWeight.bold,
      ),
      subtitleStyle: theme.textTheme.bodyMedium!.copyWith(
        color: theme.colorScheme.onSurface.withOpacity(0.7),
      ),
      amountStyle: theme.textTheme.headlineMedium!.copyWith(
        fontWeight: FontWeight.bold,
        color: const Color(0xFF00A651),
      ),
      hintStyle: theme.textTheme.bodySmall!.copyWith(
        color: theme.colorScheme.onSurface.withOpacity(0.5),
      ),
    );
  }
}
