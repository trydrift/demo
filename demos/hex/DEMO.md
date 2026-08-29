# Try Drift — Elixir / Erlang

This project uses `plug` **1.13.6**. `lib/router.ex` builds its listener with
`Plug.Adapters.Cowboy2.child_spec/1`.

The Codespace upgraded `plug` to **1.15.0**, which removed the
`Plug.Adapters.Cowboy2` shim — it had been deprecated in favour of the separate
`Plug.Cowboy` package. The module no longer exists:

```
Plug.Adapters.Cowboy2.child_spec/1 is undefined (module Plug.Adapters.Cowboy2
is not available)
```

The source code was not changed, so it still calls the removed module.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `plug`.
3. Open the affected source file.

Expected affected file: `lib/router.ex`.

Drift compares the public modules and functions, by name and arity, in both
versions' published sources.
