#!/usr/bin/env bash
# Native oracle for the npm fixture.
#
# Against the committed baseline (axios 0.21.4) `tsc --noEmit` succeeds.
# Against the upgraded tree (1.7.7) it must fail with TS2614: axios 1 removed
# the `AxiosTransformer` type that src/index.ts imports.
#
# This is what proves the fixture is a real break rather than a plausible one.
set -euo pipefail
npm install --no-audit --no-fund --silent
npm run --silent typecheck
