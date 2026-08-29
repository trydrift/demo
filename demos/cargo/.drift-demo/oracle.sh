#!/usr/bin/env bash
# Native oracle for the Rust fixture.
#
# Against the committed baseline `cargo check` succeeds. Against the upgraded
# tree it must fail with E0433: clap 4 renamed `App` to `Command` and removed
# the `App` name that src/main.rs imports.
set -euo pipefail
cargo check --quiet
echo "oracle: cargo check OK"
