# Try Drift — .NET

This project uses `AutoMapper` **8.1.1**. `Program.cs` configures its mappings
through the static `Mapper.Initialize(...)` entry point.

The Codespace upgraded `AutoMapper` to **9.0.0**, which removed the static
`Mapper` API entirely in favour of an injected `IMapper`. The call no longer
compiles:

```
error CS0117: 'Mapper' does not contain a definition for 'Initialize'
```

The source code was not changed, so it still calls the removed API.

1. Open the Drift icon in the Activity Bar.
2. Inspect the detected breaking change on `AutoMapper`.
3. Open the affected source file.

Expected affected file: `Program.cs`.

Drift compares the public types and member signatures in both versions'
published assemblies, so the analysis itself needs no .NET SDK.
