# Try Drift — C / C++ (Conan)

This project depends on `fmt` **9.1.0**.

The Codespace upgraded it to **10.2.1** and left the source code alone, so
`src/main.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The breaking change in this demo:

1. fmt 10.0.0 "removed deprecated implicit conversions for enums and conversions to primitive types for compatibility with std::format and to prevent potential ODR violations. Use `format_as` instead."

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/conan`.

From there:

1. Read what Drift found for `fmt` in the panel.
2. Open `src/main.cpp` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/conan
drift explain fmt --dir demos/conan
```

Reset it with `node scripts/reset-demo.mjs conan`.
