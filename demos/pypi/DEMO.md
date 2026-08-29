# Try Drift — Python

This project uses `Werkzeug` **2.0.3**. `src/main.py` imports
`werkzeug.security.safe_str_cmp` to compare two tokens in constant time.

The Codespace upgraded `Werkzeug` to **2.1.0**, which removed `safe_str_cmp`
(it was deprecated in 2.0 in favour of `hmac.compare_digest`). The import now
fails outright:

```
ImportError: cannot import name 'safe_str_cmp' from 'werkzeug.security'
```

The source code was not changed, so it still imports the removed function.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `Werkzeug`.
3. Open the affected source file.

Expected affected file: `src/main.py`.

This uses real published `Werkzeug` versions and the normal Drift VS Code
extension.
