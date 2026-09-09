# Try Drift — Elixir / Erlang

This project depends on `plug` **1.13.6**.

The Codespace upgraded it to **1.15.0** and left the source code alone, so
`lib/server.ex` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The breaking change in this demo:

1. Plug.Adapters.Cowboy2 was removed in Plug 1.15. It had been a deprecated shim for the separate :plug_cowboy package since Plug 1.7, and lib/plug/adapters/cowboy2.ex is simply gone from the 1.15 release, so this call raises UndefinedFunctionError.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `plug` in the panel.
2. Open `lib/server.ex` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain plug
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs hex`.
