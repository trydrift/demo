# Try Drift — Ruby

This project depends on `rack` **3.0.0**.

The Codespace upgraded it to **3.1.0** and left the source code alone, so
`lib/app.rb` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

3 breaking changes in this demo:

1. Rack::File was removed in Rack 3.1. It had been a deprecated alias of Rack::Files since 2.1.
2. Rack::Chunked was removed in Rack 3.1 — chunked encoding is handled by the server, not by middleware, under the Rack 3 spec.
3. Rack::Auth::Digest was removed in Rack 3.1; digest auth was dropped entirely rather than being replaced.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `rack`.
3. Open `lib/app.rb` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs rubygems`.
