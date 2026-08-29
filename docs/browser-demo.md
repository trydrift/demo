# Browser demo — maintainer notes

How the "Try Drift in your browser" demos are built and launched.

## The model

Each demo lives at `demos/<ecosystem>/` and is committed at the **old**
dependency version, with source code valid against it. A per-ecosystem
devcontainer applies `demos/<ecosystem>/.drift-demo/upgrade.patch` **once, at
creation time**, which moves only dependency metadata to the **new** version.
The application source is never touched.

Drift then analyses an ordinary uncommitted manifest change — the exact
situation a developer is in mid-upgrade. Nothing in Drift knows this is a demo.

## Devcontainer lifecycle

`onCreateCommand` runs the prepare step:

```
node scripts/prepare-demo.mjs <ecosystem>
```

`onCreateCommand` is used deliberately:

- it runs **after** the repository is checked out;
- it runs **once, during creation**, before the editor and the Drift extension
  start (`waitFor` is set to it), so the dependency files are already dirty
  when startup analysis runs;
- it does **not** run on resume, so reopening a Codespace never re-applies the
  patch over the visitor's own experiments.

Resume-time behaviour is intentionally left as the devcontainer default: nothing
runs.

## Workspace focus

The Git root stays at the repository root, because that is what Drift's
manifest-range detection expects. Each devcontainer instead sets
`files.exclude` for the other four demo directories, so the Explorer shows only
the relevant demo without changing anything Drift relies on.
`customizations.codespaces.openFiles` opens `DEMO.md`, the affected source file,
and the manifest.

## Extension settings

- `drift.session.mode: "ask"` — Drift analyses and explains; it never edits.
  No agent, API key, or GitHub auth is involved.
- `drift.analysis.runOnStartup: true` — the default, set explicitly.
- `drift.analysis.includePatch: true` — **go only**. `golang.org/x/exp` ships
  only pseudo-versions, which Drift classifies as patch moves.

## Deep links

GitHub's standard Codespaces deep link, one per devcontainer:

| Ecosystem | Link |
| --- | --- |
| npm | `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fnpm%2Fdevcontainer.json` |
| pypi | `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fpypi%2Fdevcontainer.json` |
| go | `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fgo%2Fdevcontainer.json` |
| cargo | `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fcargo%2Fdevcontainer.json` |
| maven | `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=.devcontainer%2Fmaven%2Fdevcontainer.json` |

These must be confirmed against the link GitHub generates from its own
Codespaces create flow before they are wired into the website (#7). They have
not been exercised end to end yet — that waits on the extension being published
to the Marketplace.

## Cost

Codespaces are created under the visitor's own GitHub account and count against
the visitor's own Codespaces allowance. The `trydrift` organisation configures
no billing, no spending limit, no payment method, and no prebuilds. Startup
cost is kept down by small fixtures, per-ecosystem images, and installing only
what each demo needs.
