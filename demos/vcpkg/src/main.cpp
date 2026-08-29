#include <spdlog/spdlog.h>
#include <spdlog/sinks/rotating_file_sink.h>

#include <string>

// This file is written against spdlog 1.11.
// The Codespace upgraded the dependency to spdlog 1.14 without touching this
// code. spdlog 1.12 bundled fmt 10, which turned several previously-accepted
// call shapes into compile errors, so the marked lines below broke.

void configure() {
    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // spdlog::set_pattern is fine, but from 1.12 spdlog vendors fmt 10, whose
    // compile-time format checking rejects a runtime std::string as a format
    // string. This call now needs fmt::runtime(..).
    std::string pattern = "[%Y-%m-%d %H:%M:%S] %v";
    spdlog::set_pattern(pattern);
}

void log_progress(const std::string& stage, int percent) {
    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // Same cause: a non-constexpr format string passed to a logging call is a
    // compile error under the bundled fmt 10.
    std::string message = "{} is {}% complete";
    spdlog::info(message, stage, percent);
}

int main() {
    configure();

    // ── BREAKING 3 ────────────────────────────────────────────────────────
    // spdlog::rotating_logger_mt's max_file_size argument became strongly
    // typed in later 1.x releases; passing a plain signed literal here relies
    // on a conversion that no longer applies cleanly.
    auto file_logger = spdlog::rotating_logger_mt("file", "logs/app.log", -1, 3);

    log_progress("indexing", 40);
    return 0;
}
