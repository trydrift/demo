# Try Drift — Go

This project depends on `golang.org/x/exp` **v0.0.0-20230522175609-2e198f4a06a1**.

The Codespace upgraded it to **v0.0.0-20231006140011-7918f672742d** and left the source code alone, so
`main.go` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 4 breaking changes in this demo:

1. slices.SortFunc took `func(a, b E) bool` (a "less" predicate). It now takes `func(a, b E) int` (a "compare" function, like cmp.Compare).
2. Same change for the stable variant.
3. slices.BinarySearchFunc's comparator moved from `func(E, T) bool` to `func(E, T) int` as part of the same sweep.
4. slices.IsSortedFunc took a "less" predicate too.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/go`.

From there:

1. Read what Drift found for `golang.org/x/exp` in the panel.
2. Open `main.go` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/go
drift explain golang.org/x/exp --dir demos/go
```

Reset it with `node scripts/reset-demo.mjs go`.
