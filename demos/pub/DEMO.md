# Try Drift — Dart / Flutter

This project depends on `dio` **4.0.6**.

The Codespace upgraded it to **5.0.0** and left the source code alone, so
`lib/api_client.dart` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Dio.lock() / unlock() / clear() were removed in Dio 5. Request-queue control is done with QueuedInterceptor now, so these three calls no longer resolve.
2. connectTimeout and receiveTimeout took an int of milliseconds in Dio 4. In Dio 5 they are `Duration?`, so assigning an int no longer type-checks.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `dio`.
3. Open `lib/api_client.dart` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs pub`.
