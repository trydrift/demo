#!/usr/bin/env bash
# Native oracle for the Go fixture.
#
# Against the committed baseline `go build` succeeds. Against the upgraded tree
# it must fail: golang.org/x/exp changed the slices comparators from
# `func(a, b E) bool` to `func(a, b E) int`, so the SortFunc call in main.go
# no longer type-checks.
set -euo pipefail
go build ./...
echo "oracle: go build OK"
