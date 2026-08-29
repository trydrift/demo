<?php

namespace DriftDemo;

use Monolog\Logger;

// This file is written against Monolog 2.9.
// The Codespace upgraded the dependency to Monolog 3.0 without touching it.

// ── BREAKING 1 ────────────────────────────────────────────────────────────
// Monolog\Handler\SwiftMailerHandler was deleted in Monolog 3 — SwiftMailer
// itself is end-of-life, and the handler went with it. This class does not
// exist in 3.x, so resolving the reference below is a fatal error.
use Monolog\Handler\SwiftMailerHandler;

class Logging
{
    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // Logger::getLevels() was removed in Monolog 3. The Level enum replaced the
    // int/name lookup tables, so this static call no longer exists.
    public static function levelNames(): array
    {
        return array_keys(Logger::getLevels());
    }

    public static function mailHandlerClass(): string
    {
        return SwiftMailerHandler::class;
    }
}
