# Try Drift — JavaScript / TypeScript

This project depends on `axios` **0.21.4**.

The Codespace upgraded it to **1.7.7** and left the source code alone, so
`src/api-client.ts` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 3 breaking changes in this demo:

1. `AxiosTransformer` was removed in axios 1.0. Response transformers are now typed as `AxiosResponseTransformer` (and request ones as `AxiosRequestTransformer`), so this import no longer resolves at all.
2. `AxiosProxyConfig` used to carry `username` / `password` directly. In axios 1.0 those moved into a nested `auth: { username, password }` object, so these two properties no longer exist on the type.
3. In axios 0.x `AxiosError` was an *interface*, so an object literal could be assigned to it. In axios 1.0 it became a *class*, and a plain object is no longer assignable — you have to construct one.

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

1. Read what Drift found for `axios` in the panel.
2. Open `src/api-client.ts` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain axios
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs npm`.
