# Try Drift — Python

This project depends on `werkzeug` **2.0.3**.

The Codespace upgraded it to **2.1.0** and left the source code alone, so
`src/auth.py` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

4 breaking changes in this demo:

1. `safe_str_cmp` was removed in Werkzeug 2.1. It was deprecated in 2.0 in favour of `hmac.compare_digest`. This import raises ImportError outright.
2. `pbkdf2_hex` and `pbkdf2_bin` were removed in Werkzeug 2.1; hashlib has `pbkdf2_hmac` built in.
3. `werkzeug.urls.Href` was removed in 2.1, along with much of the old URL helper surface.
4. The whole `werkzeug.useragents` module was removed in 2.1; `Request.user_agent` now returns a much smaller object.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `werkzeug`.
3. Open `src/auth.py` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs pypi`.
