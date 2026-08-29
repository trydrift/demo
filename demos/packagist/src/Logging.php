<?php

namespace DriftDemo;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// This file is written against Monolog 2.9.
// The Codespace upgraded the dependency to Monolog 3.0 without touching this
// code. Monolog 3 was a large cleanup, so every marked usage below is broken.

// ── BREAKING 1 ────────────────────────────────────────────────────────────
// Monolog\Handler\SwiftMailerHandler was deleted in Monolog 3 — SwiftMailer
// itself is end-of-life, and the handler went with it.
use Monolog\Handler\SwiftMailerHandler;

class Logging
{
    public static function build(string $path): Logger
    {
        $logger = new Logger('app');

        // ── BREAKING 2 ────────────────────────────────────────────────────
        // Handlers took an int level in Monolog 2 (Logger::WARNING === 300).
        // In Monolog 3 they take a Monolog\Level enum case, and passing an
        // int is a TypeError.
        $logger->pushHandler(new StreamHandler($path, Logger::WARNING));

        return $logger;
    }

    // ── BREAKING 3 ────────────────────────────────────────────────────────
    // Logger::getLevels() was removed in Monolog 3; the Level enum replaces
    // the int/name lookup tables entirely.
    public static function levelNames(): array
    {
        return array_keys(Logger::getLevels());
    }

    // ── BREAKING 4 ────────────────────────────────────────────────────────
    // Logger::getLevelName() was removed for the same reason — a Level enum
    // case knows its own name.
    public static function nameFor(int $level): string
    {
        return Logger::getLevelName($level);
    }

    public static function mailHandlerClass(): string
    {
        return SwiftMailerHandler::class;
    }
}
