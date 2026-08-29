# Try Drift — Go

This project depends on `golang.org/x/exp` at a mid-2023 pseudo-version.
`main.go` calls `slices.SortFunc` with a `less` comparator that returns `bool`.

The Codespace upgraded `golang.org/x/exp` to an October 2023 pseudo-version,
where `slices.SortFunc` (and the rest of the `slices` package) changed its
comparator from `func(a, b E) bool` to `func(a, b E) int`. The existing call
no longer compiles.

The source code was not changed, so it still passes a `bool` comparator.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `golang.org/x/exp`.
3. Open the affected source file.

Expected affected file: `main.go`.

`golang.org/x/exp` ships only pseudo-versions, so `.github/drift.yml` opts this
repo in to analysing patch-level moves. This uses real published module
versions and the normal Drift VS Code extension.
