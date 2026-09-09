#!/usr/bin/env bash
# Creation-time setup for the Rust demo Codespace.
#
# Drift's Rust surface diff shells out to `cargo public-api`, which reads
# rustdoc's unstable JSON output and so needs the nightly toolchain. Drift will
# install both itself on first analysis (`tools.autoInstall` defaults to true),
# but `cargo install cargo-public-api` compiles from source — several minutes
# with the Drift panel apparently frozen. Doing it here moves that wait into
# the Codespace build, where it belongs.
#
# cargo-public-api is pinned; the nightly channel is not, matching what Drift's
# own auto-install does (`rustup toolchain install nightly --profile minimal`).
set -euo pipefail

CARGO_PUBLIC_API_VERSION="0.52.0"

echo "==> Installing nightly toolchain (required by cargo public-api)"
rustup toolchain install nightly --profile minimal

echo "==> Installing cargo-public-api $CARGO_PUBLIC_API_VERSION"
cargo install cargo-public-api --locked --version "$CARGO_PUBLIC_API_VERSION"

echo "==> Preparing the Rust demo"
node scripts/prepare-demo.mjs cargo

echo "==> Rust demo ready"
