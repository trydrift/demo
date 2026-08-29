# Try Drift — Rust

This project uses `clap` **2.34.0**. `src/main.rs` builds its CLI with
`clap::App`, the v2 builder entry point.

The Codespace upgraded `clap` to **4.5.4**, which renamed `App` to `Command`
and removed the `App` name entirely. The code no longer compiles:
`error[E0433]: could not find 'App' in 'clap'`.

The source code was not changed, so it still refers to `clap::App`.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `clap` — `clap::App` was removed.
3. Open `src/main.rs`, where `App` is used.

Expected affected file: `src/main.rs`.

This uses real published `clap` versions and the normal Drift VS Code
extension.
