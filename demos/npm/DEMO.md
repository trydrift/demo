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

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `axios`.
3. Open `src/api-client.ts` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs npm`.
