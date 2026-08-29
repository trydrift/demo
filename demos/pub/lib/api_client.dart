import 'package:dio/dio.dart';

/// HTTP client wrapper.
///
/// This file is written against Dio 4.0. The Codespace upgraded the dependency
/// to Dio 5.0 without touching this code — Dio 5 was a large API cleanup, so
/// every marked usage below is broken.
class ApiClient {
  final Dio _dio = Dio();

  /// Hold outgoing requests while the auth token is refreshed.
  Future<void> refreshToken(Future<void> Function() refresh) async {
    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // Dio.lock() / unlock() / clear() were removed in Dio 5. Queue control is
    // done with QueuedInterceptor now.
    _dio.lock();
    try {
      await refresh();
    } finally {
      _dio.unlock();
      _dio.clear();
    }
  }

  /// Configure timeouts.
  void configureTimeouts() {
    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // connectTimeout / receiveTimeout took an int of milliseconds in Dio 4.
    // In Dio 5 they take a Duration, so an int no longer type-checks.
    _dio.options.connectTimeout = 5000;
    _dio.options.receiveTimeout = 3000;
  }

  /// Swap in a custom HTTP adapter.
  void useCustomAdapter() {
    // ── BREAKING 3 ────────────────────────────────────────────────────────
    // DefaultHttpClientAdapter was removed in Dio 5, replaced by
    // IOHttpClientAdapter.
    _dio.httpClientAdapter = DefaultHttpClientAdapter();
  }

  /// Describe a failure.
  String describe(Object error) {
    // ── BREAKING 4 ────────────────────────────────────────────────────────
    // DioError was renamed to DioException in Dio 5.
    if (error is DioError) {
      return 'request failed: ${error.message}';
    }
    return 'unknown error';
  }
}
