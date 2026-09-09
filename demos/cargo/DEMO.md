# Try Drift — Rust

This project depends on `clap` **2.34.0**.

The Codespace upgraded it to **4.5.4** and left the source code alone, so
`src/main.rs` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 5 breaking changes in this demo:

1. `clap::App` was renamed to `clap::Command` in clap 3 and the old name was removed in clap 4. This import no longer resolves.
2. `clap::SubCommand` was removed in clap 3 — subcommands are just `Command` values now, built with `Command::new(..)`.
3. `Arg::with_name` was renamed to `Arg::new` in clap 3; the old name is gone in clap 4.
4. `Arg::takes_value` was removed in clap 4 in favour of `Arg::action(ArgAction::Set)` / `num_args`.
5. `ArgMatches::value_of` was replaced by `get_one::<String>(..)` in clap 4 and removed.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `clap` in the panel.
2. Open `src/main.rs` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain clap
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs cargo`.
