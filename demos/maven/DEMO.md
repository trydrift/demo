# Try Drift — Java / Kotlin / Scala

This project depends on `com.google.guava:guava` **20.0**.

The Codespace upgraded it to **21.0** and left the source code alone, so
`src/main/java/com/example/demo/Config.java` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 4 breaking changes in this demo:

1. Objects.firstNonNull was removed in Guava 21. It moved to MoreObjects.firstNonNull back in Guava 18 and the old alias is now gone.
2. Objects.toStringHelper was removed in Guava 21 for the same reason — it is MoreObjects.toStringHelper now.
3. MoreExecutors.sameThreadExecutor() was removed in Guava 21, replaced by MoreExecutors.newDirectExecutorService().
4. The whole com.google.common.collect.MapConstraints class was removed in Guava 21 with no replacement.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

If VS Code asks whether you trust the authors of the files in this folder, say
yes. It asks before anything is allowed to run, so until it is answered both
the panel and the terminal stay empty — and the files it is asking about are
this repository's own demo fixture.

From there:

1. Read what Drift found for `com.google.guava:guava` in the panel.
2. Open `src/main/java/com/example/demo/Config.java` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain com.google.guava:guava
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs maven`.
