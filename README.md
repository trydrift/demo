# Drift demos

Browser-based example projects for Drift's **Try Drift in your browser**
experience. Each demo is a tiny, real project with a real published dependency
upgrade, analyzed by the normal [Drift](https://github.com/trydrift/drift) VS
Code extension — nothing here is demo-specific behaviour.

## How it works

Every demo is committed at the **old** dependency version, with source code
that is valid against that old version.

When a Codespace is created, a one-time setup step applies `upgrade.patch`,
which changes **only dependency metadata** (manifest, lockfile) to the **new**
version. The application source is left untouched.

The result — new dependency, old source, uncommitted — is exactly the
situation a developer is in mid-upgrade, and it is what Drift is built to
analyze. Drift already gives priority to uncommitted manifest changes, so no
special Git history is created for it.

```
committed:      dependency@OLD  +  source valid against OLD
after setup:    dependency@NEW  +  source still calling OLD   ← Drift analyzes this
```

## Available demos

The demo set and its validation status live in
[`.drift-demo/demos.json`](.drift-demo/demos.json). A demo is only linked from
the Drift website once it is validated end to end in a real Codespace.

| Ecosystem | Language | Status |
| --- | --- | --- |
| `npm` | JavaScript / TypeScript | not yet validated |
| `pypi` | Python | not yet validated |
| `go` | Go | not yet validated |
| `cargo` | Rust | not yet validated |
| `maven` | Java / Kotlin / Scala | not yet validated |

## Fixture contract

```
demos/<ecosystem>/
├── DEMO.md                     # ~12-line human guide
├── <manifest + lockfile>       # pinned to the OLD version
├── <source files>              # one file, one affected API call
└── .drift-demo/
    ├── upgrade.patch           # OLD → NEW, dependency metadata only
    └── expected.json           # semantic expectation for CI
```

## Scripts

```
node scripts/prepare-demo.mjs <ecosystem>   # apply the upgrade into the working tree
node scripts/reset-demo.mjs   <ecosystem>   # restore the committed baseline
node scripts/verify-demo.mjs  <ecosystem>   # validate one fixture
node scripts/verify-structure.mjs           # validate demos.json + every present fixture
```

The scripts have no dependencies and never run a repository-wide reset.

## Drift

Production repository: https://github.com/trydrift/drift

Running a demo requires a GitHub account and uses your own GitHub Codespaces
allowance.
