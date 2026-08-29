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

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `clap`.
3. Open `src/main.rs` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs cargo`.
