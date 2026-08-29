#!/usr/bin/env bash
# Creation-time setup for the Rust demo Codespace.
#
# Two things Drift's Rust surface diff needs, provisioned up front rather than
# lazily during the first analysis:
#
#   - the nightly toolchain, because `cargo public-api` reads rustdoc's
#     unstable JSON output, which only nightly rustc emits;
#   - `cargo-public-api` itself, which otherwise compiles from source the first
#     time the panel runs — several minutes of an apparently idle demo.
#
# Both are pinned so the demo stays deterministic. Then the fixture's
# uncommitted upgrade is applied, exactly as every other demo does it.
set -euo pipefail

# Pinned: this is the version the fixture's expected findings were verified
# against. The nightly toolchain is deliberately *not* date-pinned — this
# mirrors what Drift's own auto-install does (`rustup toolchain install
# nightly --profile minimal`), and a stale pinned nightly that cargo-public-api
# has outgrown fails harder than tracking the channel.
CARGO_PUBLIC_API_VERSION="0.52.0"

echo "==> Installing nightly toolchain (required by cargo public-api)"
rustup toolchain install nightly --profile minimal

echo "==> Installing cargo-public-api $CARGO_PUBLIC_API_VERSION"
cargo install cargo-public-api --locked --version "$CARGO_PUBLIC_API_VERSION"

echo "==> Preparing the Rust demo fixture"
node scripts/prepare-demo.mjs cargo

echo "==> Rust demo ready"
