package com.example.demo;

import com.google.common.base.Objects;
import com.google.common.collect.MapConstraints;
import com.google.common.util.concurrent.MoreExecutors;

import java.util.concurrent.ExecutorService;
import java.util.Map;

/**
 * Configuration helpers.
 *
 * <p>This class is written against Guava 20. The Codespace upgraded the
 * dependency to Guava 21 without touching this code — Guava 21 dropped a batch
 * of long-deprecated APIs, so every marked call below stopped compiling.
 */
public final class Config {

    private Config() {}

    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // Objects.firstNonNull was removed in Guava 21. It moved to
    // MoreObjects.firstNonNull back in Guava 18 and the old alias is now gone.
    public static String hostOrDefault(String configured) {
        return Objects.firstNonNull(configured, "localhost");
    }

    // ── BREAKING 2 ────────────────────────────────────────────────────────
    // Objects.toStringHelper was removed in Guava 21 for the same reason —
    // it is MoreObjects.toStringHelper now.
    public static String describe(String host, int port) {
        return Objects.toStringHelper(Config.class)
                .add("host", host)
                .add("port", port)
                .toString();
    }

    // ── BREAKING 3 ────────────────────────────────────────────────────────
    // MoreExecutors.sameThreadExecutor() was removed in Guava 21, replaced by
    // MoreExecutors.newDirectExecutorService().
    public static ExecutorService inlineExecutor() {
        return MoreExecutors.sameThreadExecutor();
    }

    // ── BREAKING 4 ────────────────────────────────────────────────────────
    // The whole com.google.common.collect.MapConstraints class was removed in
    // Guava 21 with no replacement.
    public static <K, V> Map<K, V> constrained(Map<K, V> map) {
        return MapConstraints.constrainedMap(map, MapConstraints.notNull());
    }
}
