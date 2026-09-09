# Try Drift — Dart / Flutter

This project depends on `dio` **4.0.6**.

The Codespace upgraded it to **5.0.0** and left the source code alone, so
`lib/api_client.dart` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Dio.lock() / unlock() / clear() were removed in Dio 5. Request-queue control is done with QueuedInterceptor now, so these three calls no longer resolve.
2. connectTimeout and receiveTimeout took an int of milliseconds in Dio 4. In Dio 5 they are `Duration?`, so assigning an int no longer type-checks.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `dio` in the panel.
2. Open `lib/api_client.dart` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain dio
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs pub`.
