# Try Drift — Python

This project uses `Werkzeug` **2.0.3**. `src/main.py` calls
`werkzeug.urls.url_encode(params)` to build a query string.

The Codespace upgraded `Werkzeug` to **2.1.0**, which changed the signature of
`werkzeug.urls.url_encode` (and deprecated the whole `werkzeug.urls`
form-encoding surface). The existing call no longer matches the new signature.

The source code was not changed, so it still calls the old form.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `Werkzeug`.
3. Open the affected source file.

Expected affected file: `src/main.py`.

This uses real published `Werkzeug` versions and the normal Drift VS Code
extension.
