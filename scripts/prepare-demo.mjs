#!/usr/bin/env node
// Apply a demo's dependency upgrade into the working tree, leaving source alone.
//
//   node scripts/prepare-demo.mjs <ecosystem>
//
// The committed state of every demo is `dependency@OLD` with source code valid
// against OLD. This script applies `upgrade.patch`, which moves only dependency
// metadata to `dependency@NEW`. The result — new dependency, old source — is
// the exact situation Drift is built to analyze, and it reaches Drift as an
// uncommitted manifest change (see `chooseManifestRange` in trydrift/drift).
//
// It is safe to run twice: an already-prepared fixture is detected and left as
// is. It never runs a repository-wide reset and never touches paths outside the
// selected demo.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  REPO_ROOT,
  fail,
  getDemo,
  readEcosystemArg,
  git,
  dirtyPaths,
  isDependencyFile,
} from './lib/demo-config.mjs';

const ecosystem = readEcosystemArg('prepare-demo.mjs');
const demo = getDemo(ecosystem);

const demoDir = join(REPO_ROOT, demo.demoPath);
if (!existsSync(demoDir) || !statSync(demoDir).isDirectory()) {
  fail(`demo directory ${demo.demoPath} does not exist yet`);
}

const patchPath = join(demoDir, '.drift-demo', 'upgrade.patch');
const expectedPath = join(demoDir, '.drift-demo', 'expected.json');
if (!existsSync(patchPath)) fail(`missing ${demo.demoPath}/.drift-demo/upgrade.patch`);
if (!existsSync(expectedPath)) fail(`missing ${demo.demoPath}/.drift-demo/expected.json`);

let expected;
try {
  expected = JSON.parse(readFileSync(expectedPath, 'utf8'));
} catch (error) {
  fail(`${demo.demoPath}/.drift-demo/expected.json is not valid JSON: ${error.message}`);
}

const dependencyFiles = expected.dependencyFiles;
if (!Array.isArray(dependencyFiles) || dependencyFiles.length === 0) {
  fail(`${demo.demoPath}/.drift-demo/expected.json: "dependencyFiles" must be a non-empty array`);
}
const expectedDirty = dependencyFiles.map((f) => `${demo.demoPath}/${f}`).sort();

const currentDirty = dirtyPaths(demo.demoPath).sort();

const applies = (extraArgs) =>
  git(['apply', ...extraArgs, '--directory', demo.demoPath, patchPath], { allowFailure: true }) !== null;

if (currentDirty.length > 0) {
  const alreadyPrepared =
    sameSet(currentDirty, expectedDirty) && applies(['--reverse', '--check']);
  if (alreadyPrepared) {
    process.stdout.write(
      `✓ ${ecosystem} demo already prepared — ${describe(expected)}\n` +
        `  Nothing to do. Run \`node scripts/reset-demo.mjs ${ecosystem}\` to restore the baseline.\n`,
    );
    process.exit(0);
  }
  fail(
    `working tree for ${demo.demoPath} has changes that are not this demo's upgrade:\n` +
      currentDirty.map((p) => `    ${p}`).join('\n') +
      `\n  Run \`node scripts/reset-demo.mjs ${ecosystem}\` first, or resolve these manually.`,
  );
}

if (!applies(['--check'])) {
  const detail = git(['apply', '--check', '--directory', demo.demoPath, '--verbose', patchPath], {
    allowFailure: true,
  });
  fail(`upgrade.patch does not apply cleanly to the committed baseline of ${demo.demoPath}\n${detail ?? ''}`);
}

git(['apply', '--directory', demo.demoPath, patchPath]);

const afterDirty = dirtyPaths(demo.demoPath).sort();

if (!sameSet(afterDirty, expectedDirty)) {
  git(['checkout', '--', demo.demoPath]); // undo the partial apply before failing
  const extra = afterDirty.filter((p) => !expectedDirty.includes(p));
  const missing = expectedDirty.filter((p) => !afterDirty.includes(p));
  fail(
    `upgrade.patch changed a different set of files than expected.json declares:\n` +
      (extra.length ? `  unexpected: ${extra.join(', ')}\n` : '') +
      (missing.length ? `  expected but unchanged: ${missing.join(', ')}\n` : '') +
      `  The patch must touch only ${expected.dependencyFiles.join(', ')} and no source.`,
  );
}

const nonDependency = afterDirty.filter((p) => !isDependencyFile(p.slice(demo.demoPath.length + 1)));
if (nonDependency.length > 0) {
  git(['checkout', '--', demo.demoPath]);
  fail(
    `upgrade.patch modified files Drift does not treat as dependency metadata:\n` +
      nonDependency.map((p) => `    ${p}`).join('\n'),
  );
}

process.stdout.write(
  `✓ ${ecosystem} demo prepared — ${describe(expected)}\n` +
    `  dependency files modified: ${dependencyFiles.join(', ')}\n` +
    `  application source: unchanged\n` +
    `  Drift will pick this up as an uncommitted manifest change.\n`,
);

function describe(exp) {
  return `${exp.dependency} ${exp.fromVersion} → ${exp.toVersion}`;
}

function sameSet(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
