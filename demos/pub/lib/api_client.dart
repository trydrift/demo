import 'package:dio/dio.dart';

/// HTTP client wrapper.
///
/// This file is written against Dio 4.0. The Codespace upgraded the dependency
/// to Dio 5.0 without touching it.
class ApiClient {
  final Dio _dio = Dio();

  /// Hold outgoing requests while the auth token is refreshed.
  Future<void> refreshToken(Future<void> Function() refresh) async {
    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // Dio.lock() / unlock() / clear() were removed in Dio 5. Request-queue
    // control is done with QueuedInterceptor now, so these three calls no
    // longer resolve.
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
    // connectTimeout and receiveTimeout took an int of milliseconds in Dio 4.
    // In Dio 5 they are `Duration?`, so assigning an int no longer type-checks.
    _dio.options.connectTimeout = 5000;
    _dio.options.receiveTimeout = 3000;
  }
}
