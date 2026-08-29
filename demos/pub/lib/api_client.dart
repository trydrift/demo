import 'package:dio/dio.dart';

/// Talks to the backend over HTTP.
class ApiClient {
  final Dio _dio = Dio();

  /// Hold outgoing requests while the auth token is refreshed.
  ///
  /// Dio 4 exposes lock()/unlock() to pause and resume the request queue.
  Future<void> refreshToken(Future<void> Function() refresh) async {
    _dio.lock();
    try {
      await refresh();
    } finally {
      _dio.unlock();
    }
  }
}
