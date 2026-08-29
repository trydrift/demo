# Try Drift — JavaScript / TypeScript

This project uses `lru-cache` **7.18.3**, which ships a CommonJS entry point.
`src/index.js` loads it the normal way:

```js
const { LRUCache } = require('lru-cache');
```

The Codespace upgraded `lru-cache` to **10.4.3**, which is ESM-only — it no
longer exposes a CommonJS entry point, so that `require('lru-cache')` call
throws `ERR_REQUIRE_ESM` at load time.

The source code was not changed, so it still uses `require`.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `lru-cache`.
3. Open the affected source file.

Expected affected file: `src/index.js`.

This uses real published `lru-cache` versions and the normal Drift VS Code
extension.
