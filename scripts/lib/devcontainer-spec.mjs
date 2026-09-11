// Per-ecosystem Codespace definitions, and the generator that turns them into
// .devcontainer/<ecosystem>/devcontainer.json.
//
// Generated rather than hand-written because each container has to hide the
// *other* fifteen demos from the Explorer, and that list changes every time a
// demo is added. `scripts/sync-devcontainers.mjs` writes them.

/**
 * What each ecosystem's container needs beyond the shared shape.
 *
 *   image     devcontainer base image
 *   node      set false when the image already ships Node (every demo runs the
 *             shared prepare script, which is Node)
 *   features  extra devcontainer features
 *   settings  extra VS Code settings
 */
export const ECOSYSTEM_CONTAINERS = {
  npm: {
    image: 'mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm',
    node: false,
    // Install after preparing, so the editor's own TypeScript server shows the
    // same errors the upgrade really causes.
    setup: 'node scripts/prepare-demo.mjs npm && npm --prefix demos/npm install --no-audit --no-fund',
  },
  pypi: { image: 'mcr.microsoft.com/devcontainers/python:1-3.12-bookworm' },
  go: {
    image: 'mcr.microsoft.com/devcontainers/go:1-1.22-bookworm',
    // x/exp only ships pseudo-versions, which Drift reads as a patch move.
    settings: { 'drift.analysis.includePatch': true },
  },
  cargo: {
    image: 'mcr.microsoft.com/devcontainers/rust:1-1-bookworm',
    // Drift's Rust surface diff needs `cargo public-api` + nightly, which it
    // would otherwise compile from source on first analysis. Provisioned up
    // front so the panel is not blank for minutes. See setup.sh.
    setup: '.devcontainer/cargo/setup.sh',
  },
  maven: {
    image: 'mcr.microsoft.com/devcontainers/java:1-21-bookworm',
    features: { 'ghcr.io/devcontainers/features/java:1': { version: 'none', installMaven: true } },
  },
  rubygems: { image: 'mcr.microsoft.com/devcontainers/ruby:1-3.3-bookworm' },
  nuget: { image: 'mcr.microsoft.com/devcontainers/dotnet:1-8.0-bookworm' },
  packagist: { image: 'mcr.microsoft.com/devcontainers/php:1-8.2-bookworm' },
  hex: {
    image: 'hexpm/elixir:1.15.7-erlang-26.2.1-debian-bookworm-20231009-slim',
    features: { 'ghcr.io/devcontainers/features/git:1': {} },
  },
  pub: {
    image: 'dart:3.3',
    features: { 'ghcr.io/devcontainers/features/git:1': {} },
  },
  swift: {
    image: 'swift:5.9-jammy',
    features: { 'ghcr.io/devcontainers/features/git:1': {} },
  },
  cocoapods: {
    // Codespaces is Linux, so the pod cannot be built here — building an iOS
    // target needs Xcode. The demo is the dependency change and Drift's
    // reading of it, which needs only Ruby and CocoaPods.
    image: 'mcr.microsoft.com/devcontainers/ruby:1-3.3-bookworm',
    setup: 'gem install cocoapods --no-document && node scripts/prepare-demo.mjs cocoapods',
  },
  opam: {
    image: 'ocaml/opam:debian-12-ocaml-4.14',
    features: { 'ghcr.io/devcontainers/features/node:1': { version: 'lts' } },
    node: false,
  },
  conan: {
    image: 'mcr.microsoft.com/devcontainers/cpp:1-debian-12',
    setup: 'pipx install conan && node scripts/prepare-demo.mjs conan',
  },
  vcpkg: { image: 'mcr.microsoft.com/devcontainers/cpp:1-debian-12' },
  arduino: {
    image: 'mcr.microsoft.com/devcontainers/python:1-3.12-bookworm',
    setup: 'pipx install platformio && node scripts/prepare-demo.mjs arduino',
  },
};

const NODE_FEATURE = { 'ghcr.io/devcontainers/features/node:1': { version: 'lts' } };

/** The published CLI. Every container installs it globally at creation. */
const CLI_PACKAGE = '@usedrift/cli';

/** Build the devcontainer object for one demo. */
export function buildDevcontainer(demo, allDemos) {
  const spec = ECOSYSTEM_CONTAINERS[demo.ecosystem];
  if (!spec) return null;

  const features = { ...(spec.node === false ? {} : NODE_FEATURE), ...(spec.features ?? {}) };

  const filesExclude = {};
  for (const other of allDemos) {
    if (other.ecosystem !== demo.ecosystem) filesExclude[other.dir] = true;
  }

  return {
    name: `Drift demo — ${demo.label}`,
    image: spec.image,
    // A demo is judged on how long it takes to show something, and the default
    // 2-core machine spends that budget building a container and installing an
    // extension before Drift has run at all. Asking for 4 cores makes
    // Codespaces offer the 4-core machine as the smallest that qualifies.
    //
    // It costs the visitor's own allowance twice as fast — 30 hours a month on
    // the free tier rather than 60 — which is the right trade for something
    // opened once for ten minutes, and would be the wrong one for a container
    // somebody works in all day.
    hostRequirements: { cpus: 4 },
    ...(Object.keys(features).length > 0 ? { features } : {}),
    // Runs once at creation, after checkout and before the editor starts, so
    // the dependency change is already in place when Drift's startup analysis
    // runs. It does not run on resume, so reopening a Codespace never
    // overwrites what you were experimenting with.
    // Two things, in this order: apply the upgrade, then install the CLI. The
    // demo is both halves of Drift — the panel and the command line — so the
    // visitor has to be able to type `drift` without installing anything.
    onCreateCommand: `${spec.setup ?? `node scripts/prepare-demo.mjs ${demo.ecosystem}`} && npm install -g ${CLI_PACKAGE}`,
    waitFor: 'onCreateCommand',
    // Runs on every attach, including resume, and its output lands in a real
    // terminal in the editor: the CLI half of the demo, showing itself without
    // being asked.
    //
    // Run from the repository root rather than with `--dir ${demo.dir}`: only
    // this demo's manifest is dirty, so the root detects exactly the one change
    // anyway, and it is the command a visitor would type themselves. (Before
    // @usedrift/cli 0.1.2, `--dir` below the git root also reported every
    // dependency as removed; that is fixed, but nothing here needs the flag.)
    //
    // Stdin is /dev/null so the report is where the command ends. In a
    // terminal, `drift analyze` follows a breaking change with an offer to file
    // a GitHub issue or cut a branch for it, and here that parked the startup
    // terminal on a question, flagged it as needing attention, and left the
    // visitor one keypress from opening an issue on this repository.
    postAttachCommand: 'drift analyze < /dev/null',
    customizations: {
      vscode: {
        extensions: ['drift.usedrift'],
        settings: {
          // Codespaces opens the chat sidebar by default, which takes a third
          // of the window from the Drift panel and wraps the terminal report
          // mid-word. The demo is those two; the chat is a click away.
          'workbench.secondarySideBar.defaultVisibility': 'hidden',
          // Analysis-oriented: Drift explains, it does not edit. No agent, API
          // key or GitHub auth involved.
          'drift.session.mode': 'ask',
          'drift.analysis.runOnStartup': true,
          // A visitor who opened this to see what Drift does should not have to
          // find the Activity Bar icon first.
          'drift.ui.openOnStartup': true,
          ...(spec.settings ?? {}),
          'files.exclude': filesExclude,
        },
      },
      codespaces: {
        openFiles: [`${demo.dir}/DEMO.md`, ...demo.open.map((f) => `${demo.dir}/${f}`)],
      },
    },
  };
}

export const GENERATED_HEADER = `// Generated by scripts/sync-devcontainers.mjs from demos/*/demo.json.
// Do not edit by hand — edit scripts/lib/devcontainer-spec.mjs and re-run:
//
//     node scripts/sync-devcontainers.mjs
`;
