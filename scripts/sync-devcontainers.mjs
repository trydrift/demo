#!/usr/bin/env node
// Regenerate .devcontainer/<ecosystem>/devcontainer.json from demos.json.
//
//   node scripts/sync-devcontainers.mjs [--check]
//
// With --check it writes nothing and exits non-zero if any file is stale,
// which is what CI runs.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { REPO_ROOT, loadDemosConfig, readExpected } from './lib/demo-config.mjs';
import { buildDevcontainer, GENERATED_HEADER, ECOSYSTEM_CONTAINERS } from './lib/devcontainer-spec.mjs';

const checkOnly = process.argv.includes('--check');
const { demos } = loadDemosConfig();

let stale = 0;
let written = 0;

for (const demo of demos) {
  if (!ECOSYSTEM_CONTAINERS[demo.ecosystem]) continue;
  if (!existsSync(join(REPO_ROOT, demo.demoPath))) continue;

  const config = buildDevcontainer(demo, demos, readExpected(demo));
  const content = `${GENERATED_HEADER}${JSON.stringify(config, null, 2)}\n`;
  const target = join(REPO_ROOT, demo.devcontainerPath);

  const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
  if (current === content) continue;

  if (checkOnly) {
    stale += 1;
    process.stdout.write(`  ✗ ${demo.devcontainerPath} is stale\n`);
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  written += 1;
  process.stdout.write(`  ✓ wrote ${demo.devcontainerPath}\n`);
}

if (checkOnly) {
  if (stale > 0) {
    process.stderr.write(`\n${stale} devcontainer(s) out of date — run: node scripts/sync-devcontainers.mjs\n`);
    process.exit(1);
  }
  process.stdout.write('All devcontainers are up to date.\n');
} else {
  process.stdout.write(written === 0 ? 'All devcontainers already up to date.\n' : `\n${written} file(s) written.\n`);
}
