#!/usr/bin/env node
// Restore one demo's dependency metadata to its committed baseline.
//
//   node scripts/reset-demo.mjs <ecosystem>
//
// This is the exact inverse of prepare-demo.mjs: it puts the declared
// dependency files back to `HEAD` and deletes the fixture's own known
// generated artefacts. It does not touch anything else — if you edited the
// demo's source to experiment, that stays. There is no repository-wide reset
// here, by design.

import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import {
  REPO_ROOT,
  fail,
  getDemo,
  readEcosystemArg,
  git,
  dirtyPaths,
} from './lib/demo-config.mjs';

const ecosystem = readEcosystemArg('reset-demo.mjs');
const demo = getDemo(ecosystem);

const demoDir = join(REPO_ROOT, demo.demoPath);
const expectedPath = join(demoDir, '.drift-demo', 'expected.json');
if (!existsSync(expectedPath)) fail(`missing ${demo.demoPath}/.drift-demo/expected.json`);

const expected = JSON.parse(readFileSync(expectedPath, 'utf8'));
const dependencyFiles = expected.dependencyFiles ?? [];
const generatedFiles = expected.generatedFiles ?? [];

if (!Array.isArray(dependencyFiles) || dependencyFiles.length === 0) {
  fail(`${demo.demoPath}/.drift-demo/expected.json: "dependencyFiles" must be a non-empty array`);
}

for (const relative of dependencyFiles) {
  const repoPath = `${demo.demoPath}/${relative}`;
  const tracked = git(['ls-files', '--error-unmatch', repoPath], { allowFailure: true }) !== null;
  if (tracked) {
    git(['checkout', 'HEAD', '--', repoPath]);
  } else if (existsSync(join(REPO_ROOT, repoPath))) {
    // The patch created this file; the baseline does not have it.
    rmSync(join(REPO_ROOT, repoPath));
  }
}

for (const relative of generatedFiles) {
  const target = join(demoDir, relative);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}

const stillDirty = dirtyPaths(demo.demoPath).filter((p) => {
  const rel = p.slice(demo.demoPath.length + 1);
  return dependencyFiles.includes(rel);
});
if (stillDirty.length > 0) {
  fail(`dependency files did not return to baseline:\n${stillDirty.map((p) => `    ${p}`).join('\n')}`);
}

process.stdout.write(`✓ ${ecosystem} demo reset — dependency files restored to the committed baseline\n`);

const otherChanges = dirtyPaths(demo.demoPath).filter((p) => {
  const rel = p.slice(demo.demoPath.length + 1);
  return !dependencyFiles.includes(rel) && !generatedFiles.some((g) => rel === g || rel.startsWith(`${g}/`));
});
if (otherChanges.length > 0) {
  process.stdout.write(
    `  left untouched (not part of this fixture):\n${otherChanges.map((p) => `    ${p}`).join('\n')}\n`,
  );
}
