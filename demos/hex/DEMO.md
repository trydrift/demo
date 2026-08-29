# Try Drift — Elixir / Erlang

This project depends on `plug` **1.13.6**.

The Codespace upgraded it to **1.15.0** and left the source code alone, so
`lib/server.ex` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

3 breaking changes in this demo:

1. Plug.Adapters.Cowboy2 was removed in Plug 1.15. It had been a deprecated shim for the separate :plug_cowboy package since Plug 1.7.
2. Plug.Adapters.Test.Conn was removed in the same sweep; the test helper is Plug.Test now.
3. Plug.Parsers.JSON was removed — JSON parsing goes through Plug.Parsers with a :json_decoder option.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `plug`.
3. Open `lib/server.ex` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs hex`.
