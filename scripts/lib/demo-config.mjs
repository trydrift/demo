// Shared helpers for the Drift demo lifecycle scripts.
//
// This module owns three things every script needs and none of them should
// re-implement: where the repository is, what `.drift-demo/demos.json` is
// allowed to contain, and which files count as "dependency metadata" rather
// than application source. The last one is the whole point of the demo — a
// prepared fixture is valid only when the patch touched dependency files and
// left the source alone — so the classification has to match the real Drift.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the repository root (this file lives in `scripts/lib/`). */
export const REPO_ROOT = resolve(HERE, '..', '..');

/** The demo repository's source of truth. */
export const DEMOS_JSON_PATH = join(REPO_ROOT, '.drift-demo', 'demos.json');

/** The schema version this tooling understands. */
export const SUPPORTED_SCHEMA_VERSION = 1;

/**
 * Status values a demo entry may carry. See the demo README and `demos.json`
 * for what each one commits to.
 *
 *   interactive         real end-to-end Codespaces run, Drift gives the
 *                       intended affected-code result
 *   evidence-only       the ecosystem demonstrates a weaker Drift capability
 *                       on purpose, and that is the honest outcome
 *   not-yet-validated   not exposed from the Drift website
 */
export const ALLOWED_STATUS = Object.freeze(['interactive', 'evidence-only', 'not-yet-validated']);

/**
 * Ecosystem id -> human-facing label.
 *
 * The ids are exactly Drift's ecosystem ids. The labels are checked in CI
 * against `src/detect/capabilities.ts` in `trydrift/drift`, which stays
 * authoritative; this copy exists so the demo scripts do not need the Drift
 * source tree checked out to run.
 */
export const ECOSYSTEM_LABELS = Object.freeze({
  npm: 'JavaScript / TypeScript',
  pypi: 'Python',
  go: 'Go',
  cargo: 'Rust',
  maven: 'Java / Kotlin / Scala',
  rubygems: 'Ruby',
  nuget: '.NET',
  packagist: 'PHP',
  hex: 'Elixir / Erlang',
  pub: 'Dart / Flutter',
  swift: 'Swift',
  cocoapods: 'CocoaPods',
  opam: 'OCaml',
  conan: 'C / C++ (Conan)',
  vcpkg: 'C / C++ (vcpkg)',
  arduino: 'Arduino / PlatformIO',
});

/** Every ecosystem id Drift knows, in registry order. */
export const KNOWN_ECOSYSTEMS = Object.freeze(Object.keys(ECOSYSTEM_LABELS));

/**
 * Dependency file patterns, vendored verbatim from
 * `src/detect/manifest-globs.ts` (`DEPENDENCY_FILE_GLOBS`) in `trydrift/drift`.
 *
 * Drift decides what a "manifest change" is from this list, and so does the
 * fixture contract: a prepared demo is only valid when every dirty path
 * matches one of these. Keep in sync with the upstream file; CI diffs it.
 */
export const DEPENDENCY_FILE_GLOBS = Object.freeze([
  // npm and friends
  '**/package.json',
  '**/package-lock.json',
  '**/npm-shrinkwrap.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lock',
  // Python
  '**/requirements*.txt',
  '**/constraints*.txt',
  '**/requirements*.in',
  '**/constraints*.in',
  '**/pyproject.toml',
  '**/poetry.lock',
  '**/uv.lock',
  '**/Pipfile',
  '**/Pipfile.lock',
  '**/setup.py',
  // Go
  '**/go.mod',
  '**/go.sum',
  // Rust
  '**/Cargo.toml',
  '**/Cargo.lock',
  // JVM
  '**/pom.xml',
  '**/build.gradle',
  '**/build.gradle.kts',
  '**/gradle/libs.versions.toml',
  '**/gradle.lockfile',
  '**/build.sbt',
  '**/project/*.scala',
  // Ruby
  '**/Gemfile',
  '**/Gemfile.lock',
  '**/*.gemspec',
  // .NET
  '**/*.csproj',
  '**/*.fsproj',
  '**/*.vbproj',
  '**/Directory.Packages.props',
  '**/packages.config',
  '**/packages.lock.json',
  // PHP
  '**/composer.json',
  '**/composer.lock',
  // Elixir / Erlang
  '**/mix.exs',
  '**/mix.lock',
  '**/rebar.config',
  // Dart / Flutter
  '**/pubspec.yaml',
  '**/pubspec.yml',
  '**/pubspec.lock',
  // Swift
  '**/Package.swift',
  '**/Package@swift-*.swift',
  '**/Package.resolved',
  // CocoaPods
  '**/Podfile',
  '**/Podfile.lock',
  // OCaml
  '**/dune-project',
  '**/*.opam',
  '**/*.opam.locked',
  // C / C++
  '**/conanfile.txt',
  '**/conanfile.py',
  '**/conan.lock',
  '**/vcpkg.json',
  '**/vcpkg-configuration.json',
  // Embedded
  '**/library.properties',
  '**/platformio.ini',
]);

const DEPENDENCY_FILE_REGEXPS = DEPENDENCY_FILE_GLOBS.map(globToRegExp);

function globToRegExp(glob) {
  // Split on `**/` so it can be handled as "zero or more leading directories"
  // without needing a placeholder character inside the string.
  const body = glob
    .split('**/')
    .map((part) => part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*'))
    .join('(?:.*/)?');
  return new RegExp(`^${body}$`);
}

/**
 * True when `relPath` is a dependency manifest / lockfile as Drift defines it.
 * `relPath` is interpreted relative to a repository or demo directory; leading
 * `./` and platform separators are tolerated.
 */
export function isDependencyFile(relPath) {
  const normalized = String(relPath).split(sep).join('/').replace(/^\.\//, '');
  return DEPENDENCY_FILE_REGEXPS.some((re) => re.test(normalized));
}

/** Print `message` to stderr and exit non-zero. */
export function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

/**
 * Read and structurally validate `.drift-demo/demos.json`. Exits non-zero with
 * a specific message on any problem. Returns `{ schemaVersion, demos }`.
 */
export function loadDemosConfig() {
  if (!existsSync(DEMOS_JSON_PATH)) fail(`missing ${relative(REPO_ROOT, DEMOS_JSON_PATH)}`);

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(DEMOS_JSON_PATH, 'utf8'));
  } catch (error) {
    return fail(`.drift-demo/demos.json is not valid JSON: ${error.message}`);
  }

  if (parsed?.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    fail(`.drift-demo/demos.json: schemaVersion must be ${SUPPORTED_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(parsed.demos)) fail('.drift-demo/demos.json: "demos" must be an array');

  const seen = new Set();
  for (const [index, demo] of parsed.demos.entries()) {
    const at = `.drift-demo/demos.json: demos[${index}]`;
    for (const key of ['ecosystem', 'label', 'status', 'demoPath', 'devcontainerPath']) {
      if (typeof demo?.[key] !== 'string' || demo[key].length === 0) {
        fail(`${at}: "${key}" is required and must be a non-empty string`);
      }
    }
    if (!KNOWN_ECOSYSTEMS.includes(demo.ecosystem)) {
      fail(`${at}: unknown ecosystem "${demo.ecosystem}" (not a Drift ecosystem id)`);
    }
    if (seen.has(demo.ecosystem)) fail(`${at}: duplicate ecosystem "${demo.ecosystem}"`);
    seen.add(demo.ecosystem);

    if (demo.label !== ECOSYSTEM_LABELS[demo.ecosystem]) {
      fail(
        `${at}: label "${demo.label}" does not match the Drift capability label ` +
          `"${ECOSYSTEM_LABELS[demo.ecosystem]}" for ${demo.ecosystem}`,
      );
    }
    if (!ALLOWED_STATUS.includes(demo.status)) {
      fail(`${at}: status "${demo.status}" is not one of ${ALLOWED_STATUS.join(', ')}`);
    }
    const expectedDemoPath = `demos/${demo.ecosystem}`;
    if (demo.demoPath !== expectedDemoPath) {
      fail(`${at}: demoPath should be "${expectedDemoPath}"`);
    }
    const expectedDevcontainer = `.devcontainer/${demo.ecosystem}/devcontainer.json`;
    if (demo.devcontainerPath !== expectedDevcontainer) {
      fail(`${at}: devcontainerPath should be "${expectedDevcontainer}"`);
    }
  }

  return parsed;
}

/** Return the demo entry for `ecosystem`, or exit non-zero if it is not listed. */
export function getDemo(ecosystem) {
  const { demos } = loadDemosConfig();
  const demo = demos.find((entry) => entry.ecosystem === ecosystem);
  if (!demo) {
    fail(
      `ecosystem "${ecosystem}" is not listed in .drift-demo/demos.json ` +
        `(known: ${demos.map((d) => d.ecosystem).join(', ') || 'none'})`,
    );
  }
  return demo;
}

/**
 * Read the single ecosystem id from `argv`, validating it against
 * `KNOWN_ECOSYSTEMS`. `scriptName` is used only for the usage message.
 */
export function readEcosystemArg(scriptName) {
  const [ecosystem, ...rest] = process.argv.slice(2);
  if (!ecosystem || rest.length > 0) {
    fail(`usage: node scripts/${scriptName} <ecosystem>\n       ecosystem is one of: ${KNOWN_ECOSYSTEMS.join(', ')}`);
  }
  if (!KNOWN_ECOSYSTEMS.includes(ecosystem)) {
    fail(`"${ecosystem}" is not a Drift ecosystem id (expected one of: ${KNOWN_ECOSYSTEMS.join(', ')})`);
  }
  return ecosystem;
}

/**
 * Run `git` with `args`. Returns trimmed stdout on success. On failure, exits
 * non-zero unless `allowFailure` is set, in which case `null` is returned.
 */
export function git(args, { cwd = REPO_ROOT, allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    if (allowFailure) return null;
    const detail = (result.stderr || result.stdout || '').trim();
    return fail(`git ${args.join(' ')} failed:\n${detail}`);
  }
  return result.stdout.trimEnd();
}

/**
 * Paths (repo-relative, forward slashes) that differ from `HEAD` in the working
 * tree, restricted to `pathspec` when given. Covers staged and unstaged edits
 * and untracked files, which is exactly the set Drift's `chooseManifestRange`
 * inspects.
 */
export function dirtyPaths(pathspec) {
  const args = ['status', '--porcelain', '--untracked-files=all'];
  if (pathspec) args.push('--', pathspec);
  const out = git(args);
  if (!out) return [];
  return out
    .split('\n')
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((p) => (p.includes(' -> ') ? p.split(' -> ')[1] : p));
}

/** Join a demo-relative path onto its demo directory, as a repo-relative path. */
export function demoRelative(demo, ...parts) {
  return [demo.demoPath, ...parts].join('/');
}
