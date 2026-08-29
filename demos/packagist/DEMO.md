# Try Drift — PHP

This project uses `monolog/monolog` **2.9.3**. `src/MailErrorHandler.php`
subclasses `Monolog\Handler\SwiftMailerHandler` to send error records by email.

The Codespace upgraded Monolog to **3.5.0**, which deleted that handler. Loading
the subclass now fails:

```
Error: Class "Monolog\Handler\SwiftMailerHandler" not found
```

The source code was not changed, so it still extends the removed class.

1. Open the Drift icon in the Activity Bar.
2. Read the migration evidence Drift gathered for the upgrade.
3. Open the affected source file.

Expected affected file: `src/MailErrorHandler.php`.

PHP publishes no machine-comparable API artefact, so Drift's capability
registry marks its API surface as unsupported. Drift reports the version move
and the migration notes it retrieved — but it does not know this particular
class was deleted, which is why this demo is not yet exposed on the website.
