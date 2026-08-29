use clap::App;

/// Build the command-line interface and parse the current process arguments.
fn parse_args() {
    // clap 2.x exposes the builder entry point as `clap::App`.
    let _matches = App::new("drift-demo")
        .version("0.1.0")
        .about("Tiny CLI used by the Drift Rust demo")
        .get_matches();
}

fn main() {
    parse_args();
}
