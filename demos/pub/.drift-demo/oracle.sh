#!/usr/bin/env bash
# Native oracle for the Dart fixture.
#
# Against the committed baseline (dio 4.0.6) `dart analyze` passes. It reports
# lock()/unlock() as deprecated — 4.0.6 already announces they will be deleted
# in 5.0 — and a deprecation is an `info`, which is not fatal. That is the
# realistic pre-upgrade state: valid code, on notice.
#
# Against the upgraded tree (5.0.0) it must fail: the methods are gone, so the
# calls are errors rather than infos.
#
# `--fatal-infos` is deliberately NOT used; it would fail the baseline on the
# deprecation and hide the difference this fixture exists to show.
set -euo pipefail
dart pub get
dart analyze
echo "oracle: dart analyze OK"
