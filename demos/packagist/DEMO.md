# Try Drift — PHP

This project depends on `monolog/monolog` **2.9.3**.

The Codespace upgraded it to **3.5.0** and left the source code alone, so
`src/Logging.php` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

4 breaking changes in this demo:

1. Monolog\Handler\SwiftMailerHandler was deleted in Monolog 3 — SwiftMailer itself is end-of-life, and the handler went with it.
2. Handlers took an int level in Monolog 2 (Logger::WARNING === 300). In Monolog 3 they take a Monolog\Level enum case, and passing an int is a TypeError.
3. Logger::getLevels() was removed in Monolog 3; the Level enum replaces the int/name lookup tables entirely.
4. Logger::getLevelName() was removed for the same reason — a Level enum case knows its own name.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `monolog/monolog`.
3. Open `src/Logging.php` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs packagist`.
