# Try Drift — Python

This project depends on `werkzeug` **2.0.3**.

The Codespace upgraded it to **2.1.0** and left the source code alone, so
`src/auth.py` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 4 breaking changes in this demo:

1. `safe_str_cmp` was removed in Werkzeug 2.1. It was deprecated in 2.0 in favour of `hmac.compare_digest`. This import raises ImportError outright.
2. `pbkdf2_hex` and `pbkdf2_bin` were removed in Werkzeug 2.1; hashlib has `pbkdf2_hmac` built in.
3. `werkzeug.urls.Href` was removed in 2.1, along with much of the old URL helper surface.
4. The whole `werkzeug.useragents` module was removed in 2.1; `Request.user_agent` now returns a much smaller object.

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

From there:

1. Read what Drift found for `werkzeug` in the panel.
2. Open `src/auth.py` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain werkzeug
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs pypi`.
