# Try Drift — C / C++ (Conan)

This project depends on `fmt` **9.1.0**.

The Codespace upgraded it to **10.2.1** and left the source code alone, so
`src/main.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The breaking change in this demo:

1. fmt 10.0.0 "removed deprecated implicit conversions for enums and conversions to primitive types for compatibility with std::format and to prevent potential ODR violations. Use `format_as` instead."

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `fmt`.
3. Open `src/main.cpp` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs conan`.
