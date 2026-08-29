# Ecosystem status

Which of Drift's sixteen ecosystems have a demo, and why the rest do not yet.
`.drift-demo/demos.json` is the machine-readable version of this; this file
records the *reasons*, which a status enum cannot carry.

A demo only ships when three things hold:

1. **The break is real.** `scripts/verify-oracle.mjs` compiles or runs the
   fixture with the ecosystem's own toolchain: the committed baseline must
   succeed and the upgraded tree must fail, for the stated reason.
2. **The fixture is honest.** Committed at the old version, source valid
   against it, and the patch touches only dependency metadata.
3. **Drift has something to say.** Either a localized finding (`interactive`)
   or cited evidence and a recommendation (`evidence-only`).

An ecosystem that satisfies 1 and 2 but not 3 stays `not-yet-validated`. That
is a real outcome, not a gap to paper over — see §39 of the project brief.

## Shipped

| Ecosystem | Dependency | Old → New | Drift result | Status |
| --- | --- | --- | --- | --- |
| `npm` | `axios` | 0.21.4 → 1.7.7 | `removed-export` `AxiosTransformer`, localized (2 sites) | interactive-grade |
| `pypi` | `Werkzeug` | 2.0.3 → 2.1.0 | `removed-export` `safe_str_cmp`, localized (2 sites) | interactive-grade |
| `go` | `golang.org/x/exp` | 2023-05 → 2023-10 | `signature-change` `slices.SortFunc`, localized | interactive-grade |
| `cargo` | `clap` | 2.34.0 → 4.5.4 | `removed-export` `clap::App`, **not** localized | interactive-grade, no call site |
| `maven` | `com.google.guava:guava` | 20.0 → 21.0 | `removed-export` `Objects.firstNonNull`, localized | interactive-grade |
| `nuget` | `AutoMapper` | 8.1.1 → 9.0.0 | `removed-export` `Mapper.Initialize`, localized | interactive-grade |
| `hex` | `plug` | 1.13.6 → 1.15.0 | `removed-export` `Plug.Adapters.Cowboy2`, localized | interactive-grade |
| `pub` | `dio` | 4.0.6 → 5.0.0 | `removed-export` `Dio.lock`/`unlock`, localized (2 sites) | interactive-grade |
| `rubygems` | `rack` | 3.0.0 → 3.1.0 | no surface diff; 10 changelog sections cited, `do-not-upgrade-yet` | **evidence-only** |
| `packagist` | `monolog/monolog` | 2.9.3 → 3.5.0 | 5 findings, 11 notes — none naming the deleted class; `safe-to-upgrade` | not-yet-validated |

Every demo above is left `not-yet-validated` in `demos.json` until the VS Code
extension is published and a real Codespace run confirms it end to end. The
"interactive-grade" label above describes the analysis Drift produces today, not
a validated browser demo.

## Not yet built, and why

### `swift`

A fixture was built and **withdrawn**, which is worth recording.

`swift-argument-parser` 0.4.4 → 1.0.3 looked like a clean removal: diffing
`public enum` declarations showed `ArrayParsingStrategy` present in 0.4.4 and
absent in 1.0.3. The oracle disproved it — the upgraded tree still built. The
type was not removed; it changed from an `enum` to a `public struct` with the
same name and the same `.upToNextOption` member, so consumer code is unaffected.
The diff method was wrong, not the library.

`swift-argument-parser` 1.0.3 → 1.5.0 has no public symbol removals at all.

Separately, Drift returns nothing for either Swift pair — no findings, no
changelog sections, `safe-to-upgrade`. SwiftPM identifies packages by git URL
with no central registry, so Drift declares `surface: none` and only partial
evidence here. Both halves need solving before a Swift demo is worth shipping.

### `cocoapods`

Codespaces is Linux. CocoaPods' meaningful verification — building a pod against
an app target — needs Xcode, so an oracle cannot run there, and §40 is explicit
that faking macOS is not an option. Drift's registry already declares
`verify: none` and `surface: none` for CocoaPods. A demo would have to rest on
podspec metadata alone.

### `opam`

Drift declares `surface: none` and `convention`-based localization for OCaml,
and reads releases from the opam-repository index rather than an API. Needs the
same evidence-quality check `rubygems` got before it is worth building.

### `conan`, `vcpkg`

Both have a genuine C/C++ header surface diff in Drift, which makes them the
most promising of the remainder. Not yet built. `vcpkg` additionally has the
baseline problem Drift's own registry names: one commit of the ports tree
decides every version at once, so expressing "one dependency moved" in the
fixture model needs care.

### `arduino`

Shares the C/C++ surface diff. Not yet built.
