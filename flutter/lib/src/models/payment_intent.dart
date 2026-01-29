/// Represents a Payment Intent from the Micropay API.
class PaymentIntent {
  /// Unique identifier for the payment intent.
  final String id;

  /// Amount in the smallest currency unit (e.g., cents for KES).
  final int amount;

  /// Three-letter ISO currency code (e.g., 'KES').
  final String currency;

  /// Current status of the payment intent.
  final PaymentIntentStatus status;

  /// Client secret for confirming the payment.
  final String? clientSecret;

  /// Phone number for M-Pesa payment.
  final String? phoneNumber;

  /// Description of the payment.
  final String? description;

  /// Additional metadata attached to the payment.
  final Map<String, dynamic>? metadata;

  /// Timestamp when the intent was created.
  final DateTime? createdAt;

  /// Timestamp when the intent was last updated.
  final DateTime? updatedAt;

  /// Error message if the payment failed.
  final String? errorMessage;

  /// Provider-specific reference (e.g., M-Pesa receipt number).
  final String? providerReference;

  PaymentIntent({
    required this.id,
    required this.amount,
    required this.currency,
    required this.status,
    this.clientSecret,
    this.phoneNumber,
    this.description,
    this.metadata,
    this.createdAt,
    this.updatedAt,
    this.errorMessage,
    this.providerReference,
  });

  /// Creates a PaymentIntent from a JSON response.
  factory PaymentIntent.fromJson(Map<String, dynamic> json) {
    return PaymentIntent(
      id: json['id'] as String,
      amount: json['amount'] as int,
      currency: json['currency'] as String? ?? 'KES',
      status: PaymentIntentStatus.fromString(json['status'] as String?),
      clientSecret: json['client_secret'] as String?,
      phoneNumber: json['phone_number'] as String?,
      description: json['description'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String)
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'] as String)
          : null,
      errorMessage: json['error_message'] as String?,
      providerReference: json['provider_reference'] as String?,
    );
  }

  /// Converts the PaymentIntent to a JSON map.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'currency': currency,
      'status': status.value,
      if (clientSecret != null) 'client_secret': clientSecret,
      if (phoneNumber != null) 'phone_number': phoneNumber,
      if (description != null) 'description': description,
      if (metadata != null) 'metadata': metadata,
      if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updated_at': updatedAt!.toIso8601String(),
      if (errorMessage != null) 'error_message': errorMessage,
      if (providerReference != null) 'provider_reference': providerReference,
    };
  }

  /// Creates a copy of this PaymentIntent with the given fields replaced.
  PaymentIntent copyWith({
    String? id,
    int? amount,
    String? currency,
    PaymentIntentStatus? status,
    String? clientSecret,
    String? phoneNumber,
    String? description,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? errorMessage,
    String? providerReference,
  }) {
    return PaymentIntent(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      clientSecret: clientSecret ?? this.clientSecret,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      description: description ?? this.description,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      errorMessage: errorMessage ?? this.errorMessage,
      providerReference: providerReference ?? this.providerReference,
    );
  }

  /// Whether the payment has succeeded.
  bool get isSucceeded => status == PaymentIntentStatus.succeeded;

  /// Whether the payment has failed.
  bool get isFailed => status == PaymentIntentStatus.failed;

  /// Whether the payment is still processing.
  bool get isProcessing => status == PaymentIntentStatus.processing;

  /// Whether the payment requires confirmation.
  bool get requiresConfirmation =>
      status == PaymentIntentStatus.requiresConfirmation;

  /// Formatted amount string (e.g., "KES 500.00").
  String get formattedAmount {
    final major = amount / 100;
    return '$currency ${major.toStringAsFixed(2)}';
  }

  @override
  String toString() => 'PaymentIntent(id: $id, amount: $amount, status: $status)';
}

/// Status of a Payment Intent.
enum PaymentIntentStatus {
  /// Initial state, requires confirmation.
  requiresConfirmation('requires_confirmation'),

  /// Payment has been confirmed and is processing.
  processing('processing'),

  /// Payment completed successfully.
  succeeded('succeeded'),

  /// Payment failed.
  failed('failed'),

  /// Payment was cancelled.
  cancelled('cancelled'),

  /// Unknown status.
  unknown('unknown');

  final String value;

  const PaymentIntentStatus(this.value);

  /// Creates a PaymentIntentStatus from a string value.
  static PaymentIntentStatus fromString(String? value) {
    switch (value) {
      case 'requires_confirmation':
        return PaymentIntentStatus.requiresConfirmation;
      case 'processing':
        return PaymentIntentStatus.processing;
      case 'succeeded':
        return PaymentIntentStatus.succeeded;
      case 'failed':
        return PaymentIntentStatus.failed;
      case 'cancelled':
        return PaymentIntentStatus.cancelled;
      default:
        return PaymentIntentStatus.unknown;
    }
  }

  /// Whether this status represents a terminal state.
  bool get isTerminal =>
      this == succeeded || this == failed || this == cancelled;
}
