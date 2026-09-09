# Try Drift — PHP

This project depends on `monolog/monolog` **2.9.3**.

The Codespace upgraded it to **3.5.0** and left the source code alone, so
`src/Logging.php` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 2 breaking changes in this demo:

1. Monolog\Handler\SwiftMailerHandler was deleted in Monolog 3 — SwiftMailer itself is end-of-life, and the handler went with it. This class does not exist in 3.x, so resolving the reference below is a fatal error.
2. Logger::getLevels() was removed in Monolog 3. The Level enum replaced the int/name lookup tables, so this static call no longer exists.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `monolog/monolog`.
3. Open `src/Logging.php` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs packagist`.
