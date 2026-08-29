# Try Drift — Java / Kotlin / Scala

This project uses Guava **20.0**. `Config.java` calls
`com.google.common.base.Objects.firstNonNull(...)`.

The Codespace upgraded Guava to **21.0**, which removed `firstNonNull` (and
`toStringHelper`) from `com.google.common.base.Objects` — they moved to
`com.google.common.base.MoreObjects`. The call no longer compiles.

The source code was not changed, so it still calls `Objects.firstNonNull`.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `com.google.guava:guava`.
3. Open the affected source file.

Expected affected file: `src/main/java/com/example/demo/Config.java`.

This uses real published Guava versions and the normal Drift VS Code
extension.
