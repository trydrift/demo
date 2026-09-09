// ── BREAKING 1 ────────────────────────────────────────────────────────────
// Catch2 v3 deleted the v2 single header. `catch2/catch.hpp` shipped for the
// whole 2.x line and does not exist in 3.x at all — the library was split into
// many headers, and a test file includes `catch2/catch_test_macros.hpp`
// instead. This include fails outright.
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

// ── BREAKING 2 ────────────────────────────────────────────────────────────
// CATCH_CONFIG_MAIN is gone in Catch2 v3. Catch2's own migration guide says to
// "delete TU with CATCH_CONFIG_RUNNER or CATCH_CONFIG_MAIN defined" and link
// against Catch2::Catch2WithMain instead, so defining it above no longer
// generates a main().

// This file is written against Catch2 2.13, installed through vcpkg.
// The Codespace upgraded the dependency to Catch2 3.5 without touching it.

int add(int a, int b) { return a + b; }

TEST_CASE("addition works", "[math]") {
    REQUIRE(add(2, 2) == 4);
    REQUIRE(add(-1, 1) == 0);
}
