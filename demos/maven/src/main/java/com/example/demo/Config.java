package com.example.demo;

import com.google.common.base.Objects;

/** Minimal configuration helper for the Drift Maven demo. */
public final class Config {

    private Config() {}

    /** Return {@code configured} if set, otherwise the default host. */
    public static String hostOrDefault(String configured) {
        // Guava 20 exposes Objects.firstNonNull in com.google.common.base.
        return Objects.firstNonNull(configured, "localhost");
    }
}
