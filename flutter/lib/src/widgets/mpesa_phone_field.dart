import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// A phone number input field with country code selector for M-Pesa payments.
///
/// Supports East African countries (Kenya, Tanzania, Uganda, Rwanda, Malawi).
///
/// Example:
/// ```dart
/// MpesaPhoneField(
///   controller: phoneController,
///   onChanged: (phone) => print('Phone: $phone'),
///   onCountryChanged: (country) => print('Country: ${country.code}'),
/// )
/// ```
class MpesaPhoneField extends StatefulWidget {
  /// Controller for the phone number input.
  final TextEditingController? controller;

  /// Called when the phone number changes.
  final ValueChanged<String>? onChanged;

  /// Called when the country selection changes.
  final ValueChanged<MpesaCountry>? onCountryChanged;

  /// The initial country selection.
  final MpesaCountry? initialCountry;

  /// Whether the field is enabled.
  final bool enabled;

  /// Custom hint text.
  final String? hintText;

  /// Custom label text.
  final String? labelText;

  /// Error text to display.
  final String? errorText;

  /// Focus node for the input.
  final FocusNode? focusNode;

  /// Input decoration to customize appearance.
  final InputDecoration? decoration;

  const MpesaPhoneField({
    super.key,
    this.controller,
    this.onChanged,
    this.onCountryChanged,
    this.initialCountry,
    this.enabled = true,
    this.hintText,
    this.labelText,
    this.errorText,
    this.focusNode,
    this.decoration,
  });

  @override
  State<MpesaPhoneField> createState() => _MpesaPhoneFieldState();
}

class _MpesaPhoneFieldState extends State<MpesaPhoneField> {
  late MpesaCountry _selectedCountry;
  late TextEditingController _controller;
  bool _isDropdownOpen = false;

  @override
  void initState() {
    super.initState();
    _selectedCountry = widget.initialCountry ?? MpesaCountry.kenya;
    _controller = widget.controller ?? TextEditingController();
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  String get _fullPhoneNumber {
    String number = _controller.text.replaceAll(RegExp(r'[^\d]'), '');
    if (number.isEmpty) return '';
    
    // 1. Check if the number already starts with the selected country code (e.g. 254...)
    final dialCodeRaw = _selectedCountry.dialCode.replaceAll('+', '');
    if (number.startsWith(dialCodeRaw)) {
        return '+${number}'; // It's already international format
    }

    // 2. Check if it starts with '0' (local format)
    if (number.startsWith('0')) {
        number = number.substring(1);
    }

    // 3. Prepend dial code
    return '${_selectedCountry.dialCode}$number';
  }

  void _onPhoneChanged(String value) {
    widget.onChanged?.call(_fullPhoneNumber);
  }

  void _onCountrySelected(MpesaCountry country) {
    setState(() {
      _selectedCountry = country;
      _isDropdownOpen = false;
    });
    widget.onCountryChanged?.call(country);
    widget.onChanged?.call(_fullPhoneNumber);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.labelText != null) ...[
          Text(
            widget.labelText!,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
        ],
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: widget.errorText != null
                  ? theme.colorScheme.error
                  : theme.colorScheme.outline.withOpacity(0.3),
              width: 1.5,
            ),
            color: widget.enabled
                ? theme.colorScheme.surface
                : theme.colorScheme.surfaceContainerHighest,
          ),
          child: Row(
            children: [
              // Country Selector
              _CountrySelector(
                selectedCountry: _selectedCountry,
                isOpen: _isDropdownOpen,
                enabled: widget.enabled,
                onTap: () {
                  if (widget.enabled) {
                    setState(() => _isDropdownOpen = !_isDropdownOpen);
                  }
                },
                onCountrySelected: _onCountrySelected,
              ),
              // Divider
              Container(
                width: 1,
                height: 40,
                color: theme.colorScheme.outline.withOpacity(0.2),
              ),
              // Phone input
              Expanded(
                child: TextFormField(
                  controller: _controller,
                  focusNode: widget.focusNode,
                  enabled: widget.enabled,
                  keyboardType: TextInputType.phone,
                    FilteringTextInputFormatter.digitsOnly,
                    // LengthLimitingTextInputFormatter removed to support international pastes
                    _PhoneNumberFormatter(),
                  ],
                  onChanged: _onPhoneChanged,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    letterSpacing: 1.2,
                  ),
                  decoration: widget.decoration ??
                      InputDecoration(
                        hintText: widget.hintText ?? '712 345 678',
                        hintStyle: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.4),
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 14,
                        ),
                      ),
                ),
              ),
            ],
          ),
        ),
        if (widget.errorText != null) ...[
          const SizedBox(height: 6),
          Text(
            widget.errorText!,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.error,
            ),
          ),
        ],
      ],
    );
  }
}

/// Country selector dropdown.
class _CountrySelector extends StatelessWidget {
  final MpesaCountry selectedCountry;
  final bool isOpen;
  final bool enabled;
  final VoidCallback onTap;
  final ValueChanged<MpesaCountry> onCountrySelected;

  const _CountrySelector({
    required this.selectedCountry,
    required this.isOpen,
    required this.enabled,
    required this.onTap,
    required this.onCountrySelected,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<MpesaCountry>(
      enabled: enabled,
      onSelected: onCountrySelected,
      offset: const Offset(0, 50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      itemBuilder: (context) => MpesaCountry.values.map((country) {
        return PopupMenuItem<MpesaCountry>(
          value: country,
          child: Row(
            children: [
              Text(
                country.flag,
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  country.name,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
              Text(
                country.dialCode,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.6),
                    ),
              ),
            ],
          ),
        );
      }).toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              selectedCountry.flag,
              style: const TextStyle(fontSize: 22),
            ),
            const SizedBox(width: 6),
            Text(
              selectedCountry.dialCode,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
            const SizedBox(width: 4),
            Icon(
              Icons.keyboard_arrow_down,
              size: 18,
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
            ),
          ],
        ),
      ),
    );
  }
}

/// Phone number formatter for display.
class _PhoneNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    // 1. Remove non-digits
    final digits = newValue.text.replaceAll(RegExp(r'[^\d]'), '');
    
    // 2. Handle empty case
    if (digits.isEmpty) {
      return newValue.copyWith(text: '');
    }

    // 3. Format with spaces (07XX XXX XXX)
    final buffer = StringBuffer();
    for (var i = 0; i < digits.length; i++) {
        // Add spaces after 3rd and 6th digit (for local 07... format)
        // Or adapt based on length? For now standard spacing is fine.
      if (i == 3 || i == 6) {
        buffer.write(' ');
      }
      buffer.write(digits[i]);
    }

    // 4. Don't enforce strict length limit here to allow for pasting international numbers
    // The clean-up happens in _fullPhoneNumber getters

    return newValue.copyWith(
      text: buffer.toString(),
      selection: TextSelection.collapsed(offset: buffer.length),
    );
  }
}

/// Supported M-Pesa countries.
enum MpesaCountry {
  kenya(code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪'),
  tanzania(code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿'),
  uganda(code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬'),
  rwanda(code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼'),
  malawi(code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼');

  final String code;
  final String name;
  final String dialCode;
  final String flag;

  const MpesaCountry({
    required this.code,
    required this.name,
    required this.dialCode,
    required this.flag,
  });

  /// Returns the country for a given dial code.
  static MpesaCountry? fromDialCode(String dialCode) {
    final normalized = dialCode.startsWith('+') ? dialCode : '+$dialCode';
    return MpesaCountry.values.cast<MpesaCountry?>().firstWhere(
          (c) => c?.dialCode == normalized,
          orElse: () => null,
        );
  }
}
