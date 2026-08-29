#!/usr/bin/env node
// Regenerate .devcontainer/<ecosystem>/devcontainer.json from the demos.
//
//   node scripts/sync-devcontainers.mjs [--check]

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { REPO_ROOT, allDemos } from './lib/demo-config.mjs';
import { buildDevcontainer, GENERATED_HEADER, ECOSYSTEM_CONTAINERS } from './lib/devcontainer-spec.mjs';

const checkOnly = process.argv.includes('--check');
const demos = allDemos();
let stale = 0;
let written = 0;

for (const demo of demos) {
  if (!ECOSYSTEM_CONTAINERS[demo.ecosystem]) continue;

  const content = `${GENERATED_HEADER}${JSON.stringify(buildDevcontainer(demo, demos), null, 2)}\n`;
  const target = join(REPO_ROOT, '.devcontainer', demo.ecosystem, 'devcontainer.json');

  if ((existsSync(target) ? readFileSync(target, 'utf8') : null) === content) continue;

  if (checkOnly) {
    stale += 1;
    process.stdout.write(`  ✗ .devcontainer/${demo.ecosystem}/devcontainer.json is stale\n`);
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  written += 1;
  process.stdout.write(`  ✓ .devcontainer/${demo.ecosystem}/devcontainer.json\n`);
}

if (checkOnly && stale > 0) {
  process.stderr.write(`\n${stale} out of date — run: node scripts/sync-devcontainers.mjs\n`);
  process.exit(1);
}
if (!checkOnly) process.stdout.write(`\n${written} file(s) written.\n`);
