/// Represents an error from the Micropay API.
class MicropayError implements Exception {
  /// The error code returned by the API.
  final String code;

  /// A human-readable error message.
  final String message;

  /// HTTP status code, if applicable.
  final int? statusCode;

  /// The original error that caused this exception.
  final Object? cause;

  MicropayError({
    required this.code,
    required this.message,
    this.statusCode,
    this.cause,
  });

  /// Creates a MicropayError from a JSON response.
  factory MicropayError.fromJson(Map<String, dynamic> json, {int? statusCode}) {
    return MicropayError(
      code: json['code']?.toString() ?? 'unknown_error',
      message: json['message']?.toString() ?? 'An unknown error occurred',
      statusCode: statusCode,
    );
  }

  /// Creates a network error.
  factory MicropayError.network(String message, {Object? cause}) {
    return MicropayError(
      code: 'network_error',
      message: message,
      cause: cause,
    );
  }

  /// Creates an authentication error.
  factory MicropayError.authentication(String message) {
    return MicropayError(
      code: 'authentication_error',
      message: message,
      statusCode: 401,
    );
  }

  /// Creates a validation error.
  factory MicropayError.validation(String message) {
    return MicropayError(
      code: 'validation_error',
      message: message,
      statusCode: 400,
    );
  }

  /// Creates a timeout error.
  factory MicropayError.timeout() {
    return MicropayError(
      code: 'timeout',
      message: 'The request timed out. Please try again.',
    );
  }

  /// Creates a cancelled error.
  factory MicropayError.cancelled() {
    return MicropayError(
      code: 'cancelled',
      message: 'The payment was cancelled by the user.',
    );
  }

  @override
  String toString() => 'MicropayError($code): $message';

  /// Whether this is a retryable error.
  bool get isRetryable {
    return code == 'network_error' ||
        code == 'timeout' ||
        (statusCode != null && statusCode! >= 500);
  }
}
