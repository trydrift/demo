# Try Drift — C / C++ (vcpkg)

This project depends on `catch2` **2.13.9**.

The Codespace upgraded it to **3.5.2** and left the source code alone, so
`src/tests.cpp` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Catch2 v3 deleted the v2 single header. `catch2/catch.hpp` shipped for the whole 2.x line and does not exist in 3.x at all — the library was split into many headers, and a test file includes `catch2/catch_test_macros.hpp` instead. This include fails outright.
2. CATCH_CONFIG_MAIN is gone in Catch2 v3. Catch2's own migration guide says to "delete TU with CATCH_CONFIG_RUNNER or CATCH_CONFIG_MAIN defined" and link against Catch2::Catch2WithMain instead, so defining it above no longer generates a main().

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `catch2` in the panel.
2. Open `src/tests.cpp` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain catch2
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs vcpkg`.
