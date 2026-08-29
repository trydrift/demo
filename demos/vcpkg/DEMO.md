# Try Drift — C / C++ (vcpkg)

This project depends on `catch2` **2.13.9**.

The Codespace upgraded it to **3.5.2** and left the source code alone, so
`src/tests.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Catch2 v3 deleted the v2 single header. `catch2/catch.hpp` shipped for the whole 2.x line and does not exist in 3.x at all — the library was split into many headers, and a test file includes `catch2/catch_test_macros.hpp` instead. This include fails outright.
2. CATCH_CONFIG_MAIN is gone in Catch2 v3. Catch2's own migration guide says to "delete TU with CATCH_CONFIG_RUNNER or CATCH_CONFIG_MAIN defined" and link against Catch2::Catch2WithMain instead, so defining it above no longer generates a main().

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `catch2`.
3. Open `src/tests.cpp` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs vcpkg`.
