# Try Drift — .NET

This project depends on `AutoMapper` **8.1.1**.

The Codespace upgraded it to **9.0.0** and left the source code alone, so
`Mapping.cs` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

The 5 breaking changes in this demo:

1. The static Mapper.Initialize was removed in AutoMapper 9. You build a MapperConfiguration and inject IMapper instead.
2. IMapperConfigurationExpression.CreateMissingTypeMaps was removed in AutoMapper 9; every mapping must be declared explicitly.
3. The AddProfiles(params Assembly[]) family of overloads was removed in AutoMapper 9, leaving AddMaps(..).
4. The static Mapper.Map entry point went with the rest of the static API.
5. Mapper.AssertConfigurationIsValid was removed too — it lives on the MapperConfiguration instance now.

## Try it

1. Open the Drift icon in the Activity Bar.
2. Look at what Drift found for `AutoMapper`.
3. Open `Mapping.cs` and compare against the marked lines.

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Reset it with `node scripts/reset-demo.mjs nuget`.
