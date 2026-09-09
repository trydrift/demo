# Drift demos

Small example projects for trying [Drift](https://github.com/trydrift/drift) in
the browser. Each one is pinned to an old version of a real dependency and uses
an API the newer version breaks.

Open one in a Codespace: Drift is installed, the upgrade is already applied, and
there is something real for it to find.

## How the demo state works

Each demo is committed at the **old** dependency version, with source that was
correct for it. Codespace creation edits the manifest to the **new** version and
leaves the source alone:

```
committed:      dependency@OLD  +  source written for OLD
after setup:    dependency@NEW  +  source written for OLD   ← Drift analyses this
```

`git status` in a fresh Codespace shows only the manifest as modified. Each
breaking usage carries a `BREAKING` comment naming the change.

Demos aim for **1–3 clear, documented breaks** — one indisputable example beats
several arguable ones.

## The demos

<!-- demos:start -->

| Ecosystem | Language | Dependency | Upgrade | Try |
| --- | --- | --- | --- | --- |
| `npm` | JavaScript / TypeScript | `axios` | 0.21.4 → 1.7.7 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fnpm%2Fdevcontainer.json) |
| `pypi` | Python | `werkzeug` | 2.0.3 → 2.1.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fpypi%2Fdevcontainer.json) |
| `go` | Go | `golang.org/x/exp` | 2023-05-22 → 2023-10-06 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fgo%2Fdevcontainer.json) |
| `cargo` | Rust | `clap` | 2.34.0 → 4.5.4 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fcargo%2Fdevcontainer.json) |
| `maven` | Java / Kotlin / Scala | `com.google.guava:guava` | 20.0 → 21.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fmaven%2Fdevcontainer.json) |
| `rubygems` | Ruby | `rack` | 3.0.0 → 3.1.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Frubygems%2Fdevcontainer.json) |
| `nuget` | .NET | `AutoMapper` | 8.1.1 → 9.0.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fnuget%2Fdevcontainer.json) |
| `packagist` | PHP | `monolog/monolog` | 2.9.3 → 3.5.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fpackagist%2Fdevcontainer.json) |
| `hex` | Elixir / Erlang | `plug` | 1.13.6 → 1.15.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fhex%2Fdevcontainer.json) |
| `pub` | Dart / Flutter | `dio` | 4.0.6 → 5.0.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fpub%2Fdevcontainer.json) |
| `swift` | Swift | `https://github.com/Alamofire/Alamofire` | 4.9.1 → 5.9.1 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fswift%2Fdevcontainer.json) |
| `cocoapods` | CocoaPods | `Alamofire` | 4.9.1 → 5.9.1 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fcocoapods%2Fdevcontainer.json) |
| `opam` | OCaml | `lwt` | 4.5.0 → 5.7.0 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fopam%2Fdevcontainer.json) |
| `conan` | C / C++ (Conan) | `fmt` | 9.1.0 → 10.2.1 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fconan%2Fdevcontainer.json) |
| `vcpkg` | C / C++ (vcpkg) | `catch2` | 2.13.9 → 3.5.2 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fvcpkg%2Fdevcontainer.json) |
| `arduino` | Arduino / PlatformIO | `bblanchon/ArduinoJson` | 5.13.5 → 6.21.3 | [Open](https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Farduino%2Fdevcontainer.json) |

<!-- demos:end -->

Launching one requires a GitHub account and uses your own GitHub Codespaces
allowance.

> These are prepared fixtures. No demo has been smoke-tested in a real Codespace
> yet, and the `drift.drift` Marketplace install cannot be verified until the
> extension is published.

## Layout

```
demos/<ecosystem>/
├── DEMO.md          generated from the BREAKING comments in the source
├── demo.json        dependency, versions, and the manifest edit
├── <manifest>       pinned to the old version
└── <source>         uses an API the new version breaks
```

## Scripts

```
node scripts/prepare-demo.mjs <ecosystem>   # apply the upgrade (what the Codespace runs)
node scripts/reset-demo.mjs   <ecosystem>   # put the manifest back
node scripts/sync-devcontainers.mjs         # regenerate .devcontainer/*
node scripts/make-demo-docs.mjs             # regenerate DEMO.md files
node scripts/make-readme.mjs                # regenerate the table above
node scripts/check-demos.mjs                # sanity check, no toolchains needed
```
