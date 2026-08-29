# Try Drift — Ruby

This project uses `rack` **3.0.0**. `lib/static_app.rb` builds a file server
with `Rack::File`, which 3.0 still exposes as a deprecated alias of
`Rack::Files`.

The Codespace upgraded `rack` to **3.1.0**, which removed the `Rack::File`
alias outright. The constant no longer resolves:

```
NameError: uninitialized constant Rack::File
```

The source code was not changed, so it still refers to `Rack::File`.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `rack`.
3. Open the affected source file.

Expected affected file: `lib/static_app.rb`.

Ruby publishes no static API surface for Drift to diff, so this demo rests on
release-note and changelog evidence plus the located reference — which is what
Drift's capability registry states for RubyGems.
