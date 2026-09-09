# Try Drift — PHP

This project depends on `monolog/monolog` **2.9.3**.

The Codespace upgraded it to **3.5.0** and left the source code alone, so
`src/Logging.php` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Monolog\Handler\SwiftMailerHandler was deleted in Monolog 3 — SwiftMailer itself is end-of-life, and the handler went with it. This class does not exist in 3.x, so resolving the reference below is a fatal error.
2. Logger::getLevels() was removed in Monolog 3. The Level enum replaced the int/name lookup tables, so this static call no longer exists.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze --dir demos/packagist`.

From there:

1. Read what Drift found for `monolog/monolog` in the panel.
2. Open `src/Logging.php` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze --dir demos/packagist
drift explain monolog/monolog --dir demos/packagist
```

Reset it with `node scripts/reset-demo.mjs packagist`.
