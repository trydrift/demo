// Shared helpers for the demo scripts.
//
// A demo is a tiny real project committed at an OLD dependency version, with
// source code that uses APIs the NEW version breaks. Codespace creation edits
// the manifest to the NEW version and leaves the source alone, which is exactly
// the state Drift is built to analyse: an uncommitted dependency change against
// code written for the old API.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the repository root (this file lives in `scripts/lib/`). */
export const REPO_ROOT = resolve(HERE, '..', '..');

/** Ecosystem id -> human label, matching Drift's capability registry. */
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

export const KNOWN_ECOSYSTEMS = Object.freeze(Object.keys(ECOSYSTEM_LABELS));

export function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

/** Every demo directory that exists, in registry order. */
export function allDemos() {
  return KNOWN_ECOSYSTEMS.filter((eco) => existsSync(join(REPO_ROOT, 'demos', eco, 'demo.json'))).map(readDemo);
}

/**
 * Read one demo's `demos/<eco>/demo.json`:
 *
 *   dependency  what moves
 *   from / to   the versions it moves between
 *   edits       [{ file, find, replace }] — the manifest edit that performs
 *               the upgrade. Deliberately a literal find/replace rather than a
 *               patch file: a demo upgrade is one version string, and a plain
 *               replacement is far easier to read and to keep working than a
 *               diff that goes stale the moment a line above it moves.
 *   open        files the Codespace opens, most interesting first
 */
export function readDemo(ecosystem) {
  const path = join(REPO_ROOT, 'demos', ecosystem, 'demo.json');
  if (!existsSync(path)) fail(`demos/${ecosystem}/demo.json does not exist`);
  const demo = JSON.parse(readFileSync(path, 'utf8'));
  return { ecosystem, label: ECOSYSTEM_LABELS[ecosystem], dir: `demos/${ecosystem}`, ...demo };
}

export function readEcosystemArg(scriptName) {
  const [ecosystem, ...rest] = process.argv.slice(2);
  if (!ecosystem || rest.length > 0) {
    fail(`usage: node scripts/${scriptName} <ecosystem>\n       one of: ${KNOWN_ECOSYSTEMS.join(', ')}`);
  }
  if (!KNOWN_ECOSYSTEMS.includes(ecosystem)) fail(`"${ecosystem}" is not a Drift ecosystem id`);
  return ecosystem;
}

export function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) {
    fail(`git ${args.join(' ')} failed:\n${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.status === 0 ? result.stdout.trimEnd() : null;
}
