# Drift demos

Example projects for Drift's **Try Drift in your browser** experience. Each one
is a tiny real project pinned to an old version of a real dependency, with
source code that uses APIs the newer version breaks.

Open one in a Codespace and Drift is already installed, the upgrade is already
applied, and there is something real for it to find.

## How it works

Each demo is committed at the **old** dependency version, with source code that
was correct for it. Codespace creation edits the manifest to the **new** version
and leaves the source alone:

```
committed:      dependency@OLD  +  source written for OLD
after setup:    dependency@NEW  +  source written for OLD   ← Drift analyses this
```

`git status` in a fresh Codespace shows only the manifest as modified. Every
breaking usage in the source is marked with a `BREAKING` comment explaining what
changed and why it no longer works.

## The demos

| Ecosystem | Language | Dependency | Upgrade |
| --- | --- | --- | --- |
| `npm` | JavaScript / TypeScript | `axios` | 0.21.4 → 1.7.7 |
| `pypi` | Python | `werkzeug` | 2.0.3 → 2.1.0 |
| `go` | Go | `golang.org/x/exp` | 2023-05 → 2023-10 |
| `cargo` | Rust | `clap` | 2.34.0 → 4.5.4 |
| `maven` | Java / Kotlin / Scala | `com.google.guava:guava` | 20.0 → 21.0 |
| `rubygems` | Ruby | `rack` | 3.0.0 → 3.1.0 |
| `nuget` | .NET | `AutoMapper` | 8.1.1 → 9.0.0 |
| `packagist` | PHP | `monolog/monolog` | 2.9.3 → 3.5.0 |
| `hex` | Elixir / Erlang | `plug` | 1.13.6 → 1.15.0 |
| `pub` | Dart / Flutter | `dio` | 4.0.6 → 5.0.0 |
| `swift` | Swift | `Alamofire` | 4.9.1 → 5.9.1 |
| `cocoapods` | CocoaPods | `Alamofire` | 4.9.1 → 5.9.1 |
| `opam` | OCaml | `lwt` | 4.5.0 → 5.7.0 |
| `conan` | C / C++ (Conan) | `fmt` | 9.1.0 → 10.2.1 |
| `vcpkg` | C / C++ (vcpkg) | `spdlog` | 1.11.0 → 1.14.1 |
| `arduino` | Arduino / PlatformIO | `ArduinoJson` | 5.13.5 → 6.21.3 |

## Launching one

```
https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2F<ecosystem>%2Fdevcontainer.json
```

Requires a GitHub account, and runs on your own GitHub Codespaces allowance.

## Layout

```
demos/<ecosystem>/
├── DEMO.md          generated from the BREAKING comments in the source
├── demo.json        dependency, versions, and the manifest edit
├── <manifest>       pinned to the old version
└── <source>         uses APIs the new version breaks
```

## Scripts

```
node scripts/prepare-demo.mjs <ecosystem>   # apply the upgrade (what the Codespace runs)
node scripts/reset-demo.mjs   <ecosystem>   # put the manifest back
node scripts/sync-devcontainers.mjs         # regenerate .devcontainer/*
node scripts/make-demo-docs.mjs             # regenerate DEMO.md files
node scripts/check-demos.mjs                # sanity check, no toolchains needed
```

## Drift

https://github.com/trydrift/drift
