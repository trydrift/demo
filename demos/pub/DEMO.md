# Try Drift — Dart / Flutter

This project depends on `dio` **4.0.6**.

The Codespace upgraded it to **5.0.0** and left the source code alone, so
`lib/api_client.dart` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

4 breaking changes in this demo:

1. Dio.lock() / unlock() / clear() were removed in Dio 5. Queue control is done with QueuedInterceptor now.
2. connectTimeout / receiveTimeout took an int of milliseconds in Dio 4. In Dio 5 they take a Duration, so an int no longer type-checks.
3. DefaultHttpClientAdapter was removed in Dio 5, replaced by IOHttpClientAdapter.
4. DioError was renamed to DioException in Dio 5.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `dio`.
3. Open `lib/api_client.dart` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs pub`.
