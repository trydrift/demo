#!/usr/bin/env bash
# Native oracle for the Elixir fixture.
#
# Against the committed baseline (plug 1.13.6) the project compiles. Against
# the upgraded tree (1.15.0) it must fail: Plug 1.15 removed the
# Plug.Adapters.Cowboy2 shim, so the call in lib/router.ex refers to a module
# that no longer exists. `--warnings-as-errors` turns that undefined-module
# warning into the compile failure it deserves to be.
set -euo pipefail
mix local.hex --force --if-missing >/dev/null 2>&1 || mix local.hex --force >/dev/null
mix deps.get >/dev/null
mix compile --warnings-as-errors
echo "oracle: mix compile OK"
