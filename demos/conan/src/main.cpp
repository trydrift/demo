#include <fmt/core.h>

#include <string>

// This file is written against fmt 9.1.
// The Codespace upgraded the dependency to fmt 10.2 without touching this code.

// An ordinary unscoped enum, formatted directly.
enum LogLevel { Debug, Info, Warning, Error };

// ── BREAKING ──────────────────────────────────────────────────────────────
// fmt 10.0.0 "removed deprecated implicit conversions for enums and
// conversions to primitive types for compatibility with std::format and to
// prevent potential ODR violations. Use `format_as` instead."
//
// In fmt 9 an unscoped enum was implicitly mapped to its underlying integer,
// so this compiled and printed "level=2". In fmt 10 that conversion is gone
// and LogLevel has no formatter, so this is a compile error until the project
// adds `auto format_as(LogLevel l) { return fmt::underlying(l); }`.
std::string describe(LogLevel level) {
    return fmt::format("level={}", level);
}

int main() {
    fmt::print("{}\n", describe(Warning));
    return 0;
}
