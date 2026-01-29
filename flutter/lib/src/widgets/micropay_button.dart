import 'package:flutter/material.dart';

/// A styled button for initiating Micropay payments.
///
/// Example:
/// ```dart
/// MicropayButton(
///   amount: 500,
///   currency: 'KES',
///   onPressed: () => initiatePayment(),
///   label: 'Subscribe Now',
/// )
/// ```
class MicropayButton extends StatelessWidget {
  /// Called when the button is pressed.
  final VoidCallback? onPressed;

  /// The amount to display on the button.
  final int? amount;

  /// The currency code (default: 'KES').
  final String currency;

  /// Custom label text. If null, shows "Pay [amount]".
  final String? label;

  /// Whether the button is in a loading state.
  final bool isLoading;

  /// Whether the button is disabled.
  final bool isDisabled;

  /// Button size variant.
  final MicropayButtonSize size;

  /// Button style variant.
  final MicropayButtonStyle style;

  /// Custom icon to display.
  final Widget? icon;

  /// Whether to show the M-Pesa logo.
  final bool showMpesaLogo;

  const MicropayButton({
    super.key,
    this.onPressed,
    this.amount,
    this.currency = 'KES',
    this.label,
    this.isLoading = false,
    this.isDisabled = false,
    this.size = MicropayButtonSize.medium,
    this.style = MicropayButtonStyle.primary,
    this.icon,
    this.showMpesaLogo = true,
  });

  @override
  Widget build(BuildContext context) {
    final enabled = !isDisabled && !isLoading && onPressed != null;
    
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeInOut,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: enabled ? onPressed : null,
          borderRadius: BorderRadius.circular(_borderRadius),
          child: Ink(
            decoration: BoxDecoration(
              gradient: enabled ? _gradient : null,
              color: enabled ? null : _disabledColor,
              borderRadius: BorderRadius.circular(_borderRadius),
              boxShadow: enabled
                  ? [
                      BoxShadow(
                        color: _primaryColor.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ]
                  : null,
            ),
            child: Container(
              padding: _padding,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (isLoading) ...[
                    SizedBox(
                      width: _iconSize,
                      height: _iconSize,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(_textColor),
                      ),
                    ),
                    SizedBox(width: _spacing),
                  ] else if (showMpesaLogo) ...[
                    _MpesaLogo(size: _iconSize),
                    SizedBox(width: _spacing),
                  ] else if (icon != null) ...[
                    icon!,
                    SizedBox(width: _spacing),
                  ],
                  Text(
                    _buttonText,
                    style: TextStyle(
                      color: _textColor,
                      fontSize: _fontSize,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  String get _buttonText {
    if (label != null) return label!;
    if (amount != null) {
      final formattedAmount = (amount! / 100).toStringAsFixed(0);
      return 'Pay $currency $formattedAmount';
    }
    return 'Pay with M-Pesa';
  }

  Color get _primaryColor {
    switch (style) {
      case MicropayButtonStyle.primary:
        return const Color(0xFF00A651); // M-Pesa green
      case MicropayButtonStyle.secondary:
        return const Color(0xFF1A1A2E);
      case MicropayButtonStyle.outline:
        return Colors.transparent;
    }
  }

  LinearGradient get _gradient {
    switch (style) {
      case MicropayButtonStyle.primary:
        return const LinearGradient(
          colors: [Color(0xFF00A651), Color(0xFF00C853)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case MicropayButtonStyle.secondary:
        return const LinearGradient(
          colors: [Color(0xFF1A1A2E), Color(0xFF2D2D44)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
      case MicropayButtonStyle.outline:
        return const LinearGradient(
          colors: [Colors.transparent, Colors.transparent],
        );
    }
  }

  Color get _disabledColor => Colors.grey.shade300;

  Color get _textColor {
    if (isDisabled) return Colors.grey.shade500;
    switch (style) {
      case MicropayButtonStyle.primary:
      case MicropayButtonStyle.secondary:
        return Colors.white;
      case MicropayButtonStyle.outline:
        return const Color(0xFF00A651);
    }
  }

  double get _borderRadius {
    switch (size) {
      case MicropayButtonSize.small:
        return 8;
      case MicropayButtonSize.medium:
        return 12;
      case MicropayButtonSize.large:
        return 16;
    }
  }

  EdgeInsets get _padding {
    switch (size) {
      case MicropayButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 10);
      case MicropayButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 14);
      case MicropayButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 18);
    }
  }

  double get _fontSize {
    switch (size) {
      case MicropayButtonSize.small:
        return 14;
      case MicropayButtonSize.medium:
        return 16;
      case MicropayButtonSize.large:
        return 18;
    }
  }

  double get _iconSize {
    switch (size) {
      case MicropayButtonSize.small:
        return 16;
      case MicropayButtonSize.medium:
        return 20;
      case MicropayButtonSize.large:
        return 24;
    }
  }

  double get _spacing {
    switch (size) {
      case MicropayButtonSize.small:
        return 6;
      case MicropayButtonSize.medium:
        return 8;
      case MicropayButtonSize.large:
        return 10;
    }
  }
}

/// Button size variants.
enum MicropayButtonSize { small, medium, large }

/// Button style variants.
enum MicropayButtonStyle { primary, secondary, outline }

/// Simple M-Pesa logo widget.
class _MpesaLogo extends StatelessWidget {
  final double size;

  const _MpesaLogo({required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(size / 4),
      ),
      child: Center(
        child: Text(
          'M',
          style: TextStyle(
            color: const Color(0xFF00A651),
            fontSize: size * 0.7,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
