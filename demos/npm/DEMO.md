# Try Drift — JavaScript / TypeScript

This project uses `axios` **0.21.4**. `src/index.ts` imports the
`AxiosTransformer` type and uses it to annotate a response transformer.

The Codespace upgraded `axios` to **1.7.7**, which removed the
`AxiosTransformer` type from the package's published declarations. The import
no longer resolves:

```
error TS2614: Module '"axios"' has no exported member 'AxiosTransformer'.
```

The source code was not changed, so it still imports the old type.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `axios`.
3. Open the affected source file.

Expected affected file: `src/index.ts`.

This uses real published `axios` versions and the normal Drift VS Code
extension.
