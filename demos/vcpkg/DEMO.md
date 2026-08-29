# Try Drift — C / C++ (vcpkg)

This project depends on `spdlog` **1.11.0**.

The Codespace upgraded it to **1.14.1** and left the source code alone, so
`src/main.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

3 breaking changes in this demo:

1. spdlog::set_pattern is fine, but from 1.12 spdlog vendors fmt 10, whose compile-time format checking rejects a runtime std::string as a format string. This call now needs fmt::runtime(..).
2. Same cause: a non-constexpr format string passed to a logging call is a compile error under the bundled fmt 10.
3. spdlog::rotating_logger_mt's max_file_size argument became strongly typed in later 1.x releases; passing a plain signed literal here relies on a conversion that no longer applies cleanly.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `spdlog`.
3. Open `src/main.cpp` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs vcpkg`.
