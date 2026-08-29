#include <fmt/core.h>
#include <fmt/format.h>

#include <string>
#include <vector>

// This file is written against fmt 9.1.
// The Codespace upgraded the dependency to fmt 10.2 without touching this
// code. fmt 10 tightened its API considerably, so every marked call below
// stopped compiling.

std::string report(const std::string& name, int count) {
    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // fmt 10 made compile-time format-string checking the default for
    // fmt::format. A runtime std::string as the format argument is now a
    // compile error unless you wrap it in fmt::runtime(..).
    std::string pattern = "{}: {} items\n";
    return fmt::format(pattern, name, count);
}

std::string join_names(const std::vector<std::string>& names) {
    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // fmt::join moved out of <fmt/format.h> into <fmt/ranges.h> in fmt 10, so
    // this no longer resolves with the headers included above.
    return fmt::format("{}", fmt::join(names, ", "));
}

int main() {
    // ── BREAKING 3 ────────────────────────────────────────────────────────
    // fmt::print(FILE*, ..) with a non-constexpr format string is affected by
    // the same compile-time checking change as fmt::format above.
    fmt::print(stdout, report("widgets", 3));
    fmt::print("{}\n", join_names({"ada", "grace"}));
    return 0;
}
