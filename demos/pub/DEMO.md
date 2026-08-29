# Try Drift — Dart / Flutter

This project uses `dio` **4.0.6**. `lib/api_client.dart` pauses the request
queue with `lock()` / `unlock()` while it refreshes an auth token.

The Codespace upgraded `dio` to **5.0.0**, which removed those request-queue
controls. The calls no longer analyze:

```
error: The method 'lock' isn't defined for the type 'Dio'
```

The source code was not changed, so it still calls the removed API.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `dio`.
3. Open the affected source file.

Expected affected file: `lib/api_client.dart`.

Drift compares the public declarations of both versions' published libraries,
following each `export` out of the private `lib/src` tree the way a consumer's
import does.
