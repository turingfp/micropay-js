import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

import 'models/payment_intent.dart';
import 'models/micropay_error.dart';

/// Configuration options for the Micropay client.
class MicropayConfig {
  /// Your Micropay public key (pk_test_... or pk_live_...).
  final String publicKey;

  /// API base URL. Defaults to production.
  final String baseUrl;

  /// Request timeout duration.
  final Duration timeout;

  /// Enable debug logging.
  final bool debug;

  MicropayConfig({
    required this.publicKey,
    this.baseUrl = 'https://api.micropay.io/v1',
    this.timeout = const Duration(seconds: 30),
    this.debug = false,
  });

  /// Whether this is a test environment.
  bool get isTestMode => publicKey.startsWith('pk_test_');
}

/// The main Micropay client for Flutter applications.
///
/// Use this class to create and manage payment intents.
///
/// Example:
/// ```dart
/// final micropay = Micropay(publicKey: 'pk_test_...');
///
/// final intent = await micropay.createPaymentIntent(
///   amount: 500,
///   phoneNumber: '254712345678',
/// );
/// ```
class Micropay {
  final MicropayConfig _config;
  final http.Client _httpClient;

  /// Creates a new Micropay client.
  ///
  /// [publicKey] is your Micropay public key.
  /// [baseUrl] optionally overrides the API base URL.
  /// [timeout] sets the request timeout (default: 30 seconds).
  /// [debug] enables debug logging.
  Micropay({
    required String publicKey,
    String? baseUrl,
    Duration? timeout,
    bool debug = false,
    http.Client? httpClient,
  })  : _config = MicropayConfig(
          publicKey: publicKey,
          baseUrl: baseUrl ?? 'https://api.micropay.io/v1',
          timeout: timeout ?? const Duration(seconds: 30),
          debug: debug,
        ),
        _httpClient = httpClient ?? http.Client();

  /// The current configuration.
  MicropayConfig get config => _config;

  /// Whether the client is in test mode.
  bool get isTestMode => _config.isTestMode;

  /// Creates a new payment intent.
  ///
  /// [amount] is the amount in the smallest currency unit (e.g., cents).
  /// [phoneNumber] is the M-Pesa phone number to charge.
  /// [currency] is the three-letter currency code (default: 'KES').
  /// [description] is an optional description for the payment.
  /// [metadata] is optional key-value data to attach to the payment.
  /// [idempotencyKey] prevents duplicate charges for the same request.
  Future<PaymentIntent> createPaymentIntent({
    required int amount,
    required String phoneNumber,
    String currency = 'KES',
    String? description,
    Map<String, dynamic>? metadata,
    String? idempotencyKey,
  }) async {
    final body = {
      'amount': amount,
      'currency': currency,
      'phone_number': phoneNumber,
      if (description != null) 'description': description,
      if (metadata != null) 'metadata': metadata,
    };

    final response = await _post(
      '/payment-intents',
      body: body,
      idempotencyKey: idempotencyKey,
    );

    return PaymentIntent.fromJson(response);
  }

  /// Confirms a payment intent.
  ///
  /// This initiates the M-Pesa STK Push to the user's phone.
  ///
  /// [paymentIntentId] is the ID of the payment intent to confirm.
  /// [clientSecret] is the client secret from the payment intent.
  Future<PaymentIntent> confirmPaymentIntent(
    String paymentIntentId,
    String clientSecret,
  ) async {
    final response = await _post(
      '/payment-intents/$paymentIntentId/confirm',
      body: {'client_secret': clientSecret},
    );

    return PaymentIntent.fromJson(response);
  }

  /// Retrieves a payment intent by ID.
  ///
  /// [paymentIntentId] is the ID of the payment intent to retrieve.
  Future<PaymentIntent> getPaymentIntent(String paymentIntentId) async {
    final response = await _get('/payment-intents/$paymentIntentId');
    return PaymentIntent.fromJson(response);
  }

  /// Polls for payment completion.
  ///
  /// Returns the final payment intent when the payment succeeds or fails.
  ///
  /// [paymentIntentId] is the ID of the payment intent to poll.
  /// [pollInterval] is the time between polls (default: 2 seconds).
  /// [maxAttempts] is the maximum number of poll attempts (default: 60).
  /// [onStatusChange] is called when the status changes.
  Future<PaymentIntent> pollPaymentStatus(
    String paymentIntentId, {
    Duration pollInterval = const Duration(seconds: 2),
    int maxAttempts = 60,
    void Function(PaymentIntentStatus status)? onStatusChange,
  }) async {
    PaymentIntentStatus? lastStatus;

    for (var attempt = 0; attempt < maxAttempts; attempt++) {
      final intent = await getPaymentIntent(paymentIntentId);

      if (intent.status != lastStatus) {
        lastStatus = intent.status;
        onStatusChange?.call(intent.status);
      }

      if (intent.status.isTerminal) {
        return intent;
      }

      await Future.delayed(pollInterval);
    }

    throw MicropayError.timeout();
  }

  /// Cancels a payment intent.
  ///
  /// [paymentIntentId] is the ID of the payment intent to cancel.
  Future<PaymentIntent> cancelPaymentIntent(String paymentIntentId) async {
    final response = await _post('/payment-intents/$paymentIntentId/cancel');
    return PaymentIntent.fromJson(response);
  }

  // HTTP helper methods

  Future<Map<String, dynamic>> _get(String path) async {
    final uri = Uri.parse('${_config.baseUrl}$path');
    
    _log('GET $uri');

    try {
      final response = await _httpClient
          .get(uri, headers: _headers)
          .timeout(_config.timeout);

      return _handleResponse(response);
    } on TimeoutException {
      throw MicropayError.timeout();
    } catch (e) {
      throw MicropayError.network('Failed to connect to Micropay', cause: e);
    }
  }

  Future<Map<String, dynamic>> _post(
    String path, {
    Map<String, dynamic>? body,
    String? idempotencyKey,
  }) async {
    final uri = Uri.parse('${_config.baseUrl}$path');
    
    _log('POST $uri');
    if (body != null) _log('Body: $body');

    final headers = Map<String, String>.from(_headers);
    if (idempotencyKey != null) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    try {
      final response = await _httpClient
          .post(
            uri,
            headers: headers,
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(_config.timeout);

      return _handleResponse(response);
    } on TimeoutException {
      throw MicropayError.timeout();
    } catch (e) {
      throw MicropayError.network('Failed to connect to Micropay', cause: e);
    }
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ${_config.publicKey}',
        'X-Micropay-Client': 'flutter-sdk/0.1.0',
      };

  Map<String, dynamic> _handleResponse(http.Response response) {
    _log('Response ${response.statusCode}: ${response.body}');

    Map<String, dynamic> data;
    try {
      data = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (e) {
      throw MicropayError(
        code: 'invalid_response',
        message: 'Failed to parse response from Micropay',
        statusCode: response.statusCode,
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }

    throw MicropayError.fromJson(data, statusCode: response.statusCode);
  }

  void _log(String message) {
    if (_config.debug) {
      // ignore: avoid_print
      print('[Micropay] $message');
    }
  }

  /// Disposes the HTTP client.
  void dispose() {
    _httpClient.close();
  }
}
