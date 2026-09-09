# Try Drift — Ruby

This project depends on `rack` **3.0.0**.

The Codespace upgraded it to **3.1.0** and left the source code alone, so
`lib/app.rb` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 3 breaking changes in this demo:

1. Rack::File was removed in Rack 3.1. It had been a deprecated alias of Rack::Files since 2.1.
2. Rack::Chunked was removed in Rack 3.1 — chunked encoding is handled by the server, not by middleware, under the Rack 3 spec.
3. Rack::Auth::Digest was removed in Rack 3.1; digest auth was dropped entirely rather than being replaced.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/rubygems`.

From there:

1. Read what Drift found for `rack` in the panel.
2. Open `lib/app.rb` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/rubygems
drift explain rack --dir demos/rubygems
```

Reset it with `node scripts/reset-demo.mjs rubygems`.
