#!/usr/bin/env node
// Validate one demo fixture end to end.
//
//   node scripts/verify-demo.mjs <ecosystem>
//
// Structural validation (always runs, and must pass before Drift is published):
//   - the demo is listed in demos.json
//   - DEMO.md, upgrade.patch, expected.json and every referenced file exist
//   - expected.json is well formed
//   - the committed baseline declares `fromVersion`
//   - the patch applies and moves only the declared dependency files
//   - application source is untouched
//   - the patched tree declares `toVersion`
//   - reset restores the baseline exactly
//
// Semantic validation (runs only once `@usedrift/cli` is published):
//   - execute Drift, parse its machine-readable output, and compare against
//     expected.json. Until then this section prints SKIPPED and the overall
//     result is "structure only".

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  REPO_ROOT,
  fail,
  getDemo,
  readEcosystemArg,
  dirtyPaths,
  isDependencyFile,
} from './lib/demo-config.mjs';
import { readDeclaredVersion } from './lib/manifest-version.mjs';

const ecosystem = readEcosystemArg('verify-demo.mjs');
const demo = getDemo(ecosystem);
const demoDir = join(REPO_ROOT, demo.demoPath);

const problems = [];
const check = (label, ok, detail) => {
  process.stdout.write(`${ok ? '  ✓' : '  ✗'} ${label}\n`);
  if (!ok) problems.push(detail ? `${label}: ${detail}` : label);
};

process.stdout.write(`Verifying ${ecosystem} demo (${demo.label})\n\nStructure:\n`);

// --- fixture files exist ------------------------------------------------------
check('demo directory exists', existsSync(demoDir) && statSync(demoDir).isDirectory());
if (problems.length) finish();

const need = {
  'DEMO.md': join(demoDir, 'DEMO.md'),
  'upgrade.patch': join(demoDir, '.drift-demo', 'upgrade.patch'),
  'expected.json': join(demoDir, '.drift-demo', 'expected.json'),
  'devcontainer.json': join(REPO_ROOT, demo.devcontainerPath),
};
for (const [label, path] of Object.entries(need)) check(`${label} present`, existsSync(path));
if (problems.length) finish();

// --- expected.json shape ----------------------------------------------------
let expected;
try {
  expected = JSON.parse(readFileSync(need['expected.json'], 'utf8'));
} catch (error) {
  check('expected.json parses', false, error.message);
  finish();
}

check('expected.schemaVersion === 1', expected.schemaVersion === 1);
check('expected.ecosystem matches', expected.ecosystem === ecosystem, `got "${expected.ecosystem}"`);
for (const key of ['dependency', 'fromVersion', 'toVersion']) {
  check(`expected.${key} is a non-empty string`, typeof expected[key] === 'string' && expected[key].length > 0);
}
for (const key of ['dependencyFiles', 'expectedAffectedFiles']) {
  check(`expected.${key} is a non-empty array`, Array.isArray(expected[key]) && expected[key].length > 0);
}
check('expected.expectsAffectedCallSite is a boolean', typeof expected.expectsAffectedCallSite === 'boolean');
for (const key of ['expectedSymbols', 'expectedChangeKinds']) {
  if (expected[key] !== undefined) check(`expected.${key} is an array`, Array.isArray(expected[key]));
}

// Every fixture must be able to prove its own break with the ecosystem's own
// toolchain. Structural checks cannot tell a real breaking upgrade from a
// plausible-looking one; `scripts/verify-oracle.mjs` runs this contract.
check(
  'expected.oracle.command is a non-empty string',
  typeof expected.oracle?.command === 'string' && expected.oracle.command.length > 0,
);
check(
  'expected.oracle.expectedFailurePattern is a valid regular expression',
  (() => {
    if (typeof expected.oracle?.expectedFailurePattern !== 'string') return false;
    try {
      new RegExp(expected.oracle.expectedFailurePattern);
      return true;
    } catch {
      return false;
    }
  })(),
);
if (problems.length) finish();

check('oracle script referenced by oracle.command exists', (() => {
  const named = expected.oracle.command.match(/\.drift-demo\/[\w.-]+/);
  return named ? existsSync(join(demoDir, named[0])) : true;
})());
if (problems.length) finish();

for (const rel of expected.dependencyFiles) {
  check(`dependency file ${rel} exists`, existsSync(join(demoDir, rel)));
  check(`dependency file ${rel} is a manifest Drift recognises`, isDependencyFile(rel));
}
for (const rel of expected.expectedAffectedFiles) {
  check(`affected source ${rel} exists`, existsSync(join(demoDir, rel)));
  check(`affected source ${rel} is not a dependency file`, !isDependencyFile(rel));
}
if (problems.length) finish();

// --- working tree must be clean before we touch it ------------------------
check('demo working tree is clean', dirtyPaths(demo.demoPath).length === 0, 'run reset-demo.mjs first');
if (problems.length) finish();

// --- baseline version -----------------------------------------------------
let baselineVersion;
try {
  baselineVersion = readDeclaredVersion(ecosystem, demoDir, expected.dependency, expected.dependencyFiles);
  check(
    `baseline declares ${expected.dependency}@${expected.fromVersion}`,
    baselineVersion === expected.fromVersion,
    `manifest says ${baselineVersion}`,
  );
} catch (error) {
  check('baseline version is readable', false, error.message);
}
if (problems.length) finish();

// --- prepare, inspect, reset -------------------------------------------------
const prepared = run('node', ['scripts/prepare-demo.mjs', ecosystem]);
check('prepare-demo.mjs succeeds', prepared.status === 0, prepared.output);

const afterDirty = dirtyPaths(demo.demoPath).sort();
const expectedDirty = expected.dependencyFiles.map((f) => `${demo.demoPath}/${f}`).sort();
check(
  'patch touches exactly the declared dependency files',
  JSON.stringify(afterDirty) === JSON.stringify(expectedDirty),
  `changed: ${afterDirty.join(', ') || 'nothing'}`,
);
check(
  'no application source changed',
  afterDirty.every((p) => isDependencyFile(p.slice(demo.demoPath.length + 1))),
);

try {
  const upgradedVersion = readDeclaredVersion(ecosystem, demoDir, expected.dependency, expected.dependencyFiles);
  check(
    `patched tree declares ${expected.dependency}@${expected.toVersion}`,
    upgradedVersion === expected.toVersion,
    `manifest says ${upgradedVersion}`,
  );
} catch (error) {
  check('patched version is readable', false, error.message);
}

const reset = run('node', ['scripts/reset-demo.mjs', ecosystem]);
check('reset-demo.mjs succeeds', reset.status === 0, reset.output);
check('reset restores a clean working tree', dirtyPaths(demo.demoPath).length === 0);
try {
  const restored = readDeclaredVersion(ecosystem, demoDir, expected.dependency, expected.dependencyFiles);
  check(`reset restores ${expected.dependency}@${expected.fromVersion}`, restored === expected.fromVersion);
} catch {
  /* already reported above */
}

// --- semantic validation (publication-gated) --------------------------------
process.stdout.write('\nSemantic (Drift CLI):\n');
const cliVersion = spawnSync('drift', ['--version'], { encoding: 'utf8' });
if (cliVersion.status !== 0) {
  process.stdout.write('  – SKIPPED: Drift CLI not published (@usedrift/cli)\n');
  process.stdout.write('    Semantic assertions are wired up in the validation CI (issue #5).\n');
} else {
  process.stdout.write(
    `  – SKIPPED: CLI present (${cliVersion.stdout.trim()}) but semantic assertions ` +
      'are implemented in scripts/lib/drift-runner.mjs (issue #5), not here.\n',
  );
}

finish();

function run(command, args) {
  const result = spawnSync(command, args, { cwd: REPO_ROOT, encoding: 'utf8' });
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

function finish() {
  process.stdout.write('\n');
  if (problems.length > 0) {
    fail(`${ecosystem} demo FAILED verification:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  }
  process.stdout.write(`✓ ${ecosystem} demo passed structural verification (semantic checks pending CLI publication)\n`);
  process.exit(0);
}
