#!/usr/bin/env node
// Light sanity check: every demo can be prepared and reset, the generated
// files are current, and nothing is missing. No toolchains, no network.
//
//   node scripts/check-demos.mjs

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, allDemos, KNOWN_ECOSYSTEMS } from './lib/demo-config.mjs';

// Same marker `make-demo-docs.mjs` looks for: a ruled comment line reading
// `── BREAKING ──` or `── BREAKING 2 ──`.
const BREAKING_MARKER = /──\s*BREAKING(\s+\d+)?\s*──/;

const demos = allDemos();
let failures = 0;

const check = (ok, label) => {
  process.stdout.write(`  ${ok ? '✓' : '✗'} ${label}\n`);
  if (!ok) failures += 1;
};

process.stdout.write(`${demos.length} of ${KNOWN_ECOSYSTEMS.length} ecosystems have a demo\n`);
check(demos.length === KNOWN_ECOSYSTEMS.length, `exactly ${KNOWN_ECOSYSTEMS.length} known ecosystems have a demo`);

const devcontainerCount = KNOWN_ECOSYSTEMS.filter((eco) =>
  existsSync(join(REPO_ROOT, '.devcontainer', eco, 'devcontainer.json')),
).length;
check(devcontainerCount === KNOWN_ECOSYSTEMS.length, `exactly ${KNOWN_ECOSYSTEMS.length} devcontainers exist`);
process.stdout.write('\n');

for (const demo of demos) {
  process.stdout.write(`${demo.ecosystem}\n`);

  for (const f of ['DEMO.md', ...demo.open]) {
    check(existsSync(join(REPO_ROOT, demo.dir, f)), `${f} exists`);
  }
  check(
    existsSync(join(REPO_ROOT, '.devcontainer', demo.ecosystem, 'devcontainer.json')),
    'devcontainer exists',
  );
  check(demo.edits.length >= 1, 'demo.json declares at least one edit');

  const sourceFile = demo.open[0];
  const sourcePath = join(REPO_ROOT, demo.dir, sourceFile);
  check(
    existsSync(sourcePath) && BREAKING_MARKER.test(readFileSync(sourcePath, 'utf8')),
    `${sourceFile} has at least one BREAKING marker`,
  );

  const prepared = spawnSync('node', ['scripts/prepare-demo.mjs', demo.ecosystem], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  check(prepared.status === 0, `prepare applies the upgrade${prepared.status === 0 ? '' : `\n      ${prepared.stderr.trim()}`}`);

  const dirty = spawnSync('git', ['status', '--porcelain', '--', demo.dir], { cwd: REPO_ROOT, encoding: 'utf8' })
    .stdout.split('\n')
    .map((l) => l.slice(3).trim())
    .filter(Boolean);
  const expected = demo.edits.map((e) => `${demo.dir}/${e.file}`).sort();
  check(
    JSON.stringify(dirty.sort()) === JSON.stringify(expected),
    `only the manifest changed (${dirty.join(', ') || 'nothing'})`,
  );

  spawnSync('node', ['scripts/reset-demo.mjs', demo.ecosystem], { cwd: REPO_ROOT });
  const afterReset = spawnSync('git', ['status', '--porcelain', '--', demo.dir], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  }).stdout.trim();
  check(afterReset === '', 'reset restores the baseline');
}

for (const script of ['sync-devcontainers.mjs', 'make-demo-docs.mjs', 'make-readme.mjs']) {
  const r = spawnSync('node', [`scripts/${script}`, '--check'], { cwd: REPO_ROOT, encoding: 'utf8' });
  process.stdout.write(r.stdout ?? '');
  check(r.status === 0, `${script} output is up to date`);
}

process.stdout.write(failures === 0 ? '\nAll demos OK.\n' : `\n${failures} problem(s).\n`);
process.exit(failures === 0 ? 0 : 1);
