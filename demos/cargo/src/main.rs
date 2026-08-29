// This file is written against clap 2.34.
// The Codespace upgraded the dependency to clap 4.5 without touching this
// code. clap 3 and 4 rewrote the builder API, so every marked item below is
// gone or renamed.

// ── BREAKING 1 ────────────────────────────────────────────────────────────
// `clap::App` was renamed to `clap::Command` in clap 3 and the old name was
// removed in clap 4. This import no longer resolves.
use clap::{App, Arg, ArgMatches, SubCommand};

// ── BREAKING 2 ────────────────────────────────────────────────────────────
// `clap::SubCommand` was removed in clap 3 — subcommands are just `Command`
// values now, built with `Command::new(..)`.

/// Build the command-line interface.
fn cli() -> App<'static, 'static> {
    App::new("drift-demo")
        .version("0.1.0")
        .about("Tiny CLI used by the Drift Rust demo")
        // ── BREAKING 3 ────────────────────────────────────────────────────
        // `Arg::with_name` was renamed to `Arg::new` in clap 3; the old name
        // is gone in clap 4.
        .arg(
            Arg::with_name("config")
                .long("config")
                // ── BREAKING 4 ────────────────────────────────────────────
                // `Arg::takes_value` was removed in clap 4 in favour of
                // `Arg::action(ArgAction::Set)` / `num_args`.
                .takes_value(true)
                .help("Path to the config file"),
        )
        .subcommand(SubCommand::with_name("build").about("Build the project"))
}

/// Read the `--config` value out of the parsed arguments.
fn config_path(matches: &ArgMatches) -> Option<String> {
    // ── BREAKING 5 ────────────────────────────────────────────────────────
    // `ArgMatches::value_of` was replaced by `get_one::<String>(..)` in
    // clap 4 and removed.
    matches.value_of("config").map(|s| s.to_string())
}

fn main() {
    let matches = cli().get_matches();
    println!("config: {:?}", config_path(&matches));
}
