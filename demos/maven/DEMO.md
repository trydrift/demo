# Try Drift — Java / Kotlin / Scala

This project depends on `com.google.guava:guava` **20.0**.

The Codespace upgraded it to **21.0** and left the source code alone, so
`src/main/java/com/example/demo/Config.java` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

4 breaking changes in this demo:

1. Objects.firstNonNull was removed in Guava 21. It moved to MoreObjects.firstNonNull back in Guava 18 and the old alias is now gone.
2. Objects.toStringHelper was removed in Guava 21 for the same reason — it is MoreObjects.toStringHelper now.
3. MoreExecutors.sameThreadExecutor() was removed in Guava 21, replaced by MoreExecutors.newDirectExecutorService().
4. The whole com.google.common.collect.MapConstraints class was removed in Guava 21 with no replacement.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `com.google.guava:guava`.
3. Open `src/main/java/com/example/demo/Config.java` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs maven`.
