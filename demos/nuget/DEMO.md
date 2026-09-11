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

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran `drift analyze` from the repository root, where
  this demo's manifest is the only changed one.

If VS Code asks whether you trust the authors of the files in this folder, say
yes. It asks before anything is allowed to run, so until it is answered both
the panel and the terminal stay empty — and the files it is asking about are
this repository's own demo fixture.

From there:

1. Read what Drift found for `AutoMapper` in the panel.
2. Open `Mapping.cs` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

```sh
git status --short     # only the manifest is modified; the source is untouched
```

Run it again yourself, or ask a different question:

```sh
drift analyze                    # what this upgrade breaks here
drift explain AutoMapper
```

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with `node scripts/reset-demo.mjs nuget`.
