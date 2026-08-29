# Try Drift — C / C++ (Conan)

This project depends on `fmt` **9.1.0**.

The Codespace upgraded it to **10.2.1** and left the source code alone, so
`src/main.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

3 breaking changes in this demo:

1. fmt 10 made compile-time format-string checking the default for fmt::format. A runtime std::string as the format argument is now a compile error unless you wrap it in fmt::runtime(..).
2. fmt::join moved out of <fmt/format.h> into <fmt/ranges.h> in fmt 10, so this no longer resolves with the headers included above.
3. fmt::print(FILE*, ..) with a non-constexpr format string is affected by the same compile-time checking change as fmt::format above.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `fmt`.
3. Open `src/main.cpp` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs conan`.
