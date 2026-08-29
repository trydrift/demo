#!/usr/bin/env node
// Repository-level structural check, run in CI on every push and pull request.
//
//   node scripts/verify-structure.mjs
//
// It validates `.drift-demo/demos.json` (schema, known ecosystem ids, labels
// that match Drift's capability registry, allowed status values, no
// duplicates) and then runs `verify-demo.mjs` for every fixture that exists.
//
// Rules:
//   - a demo with status "interactive" or "evidence-only" MUST have a fixture
//     that passes structural verification
//   - a demo with status "not-yet-validated" MAY have no fixture yet; if it
//     does have one, it still must pass

import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, loadDemosConfig } from './lib/demo-config.mjs';

const { demos } = loadDemosConfig();
process.stdout.write(`.drift-demo/demos.json is valid — ${demos.length} demo${demos.length === 1 ? '' : 's'} listed\n\n`);

let failures = 0;
const rows = [];

for (const demo of demos) {
  const dir = join(REPO_ROOT, demo.demoPath);
  const present = existsSync(dir) && statSync(dir).isDirectory();

  if (!present) {
    if (demo.status === 'not-yet-validated') {
      rows.push([demo.ecosystem, demo.status, 'pending — no fixture yet']);
    } else {
      failures += 1;
      rows.push([demo.ecosystem, demo.status, 'MISSING fixture for an exposed demo']);
    }
    continue;
  }

  const result = spawnSync('node', ['scripts/verify-demo.mjs', demo.ecosystem], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  process.stdout.write(result.stdout ?? '');
  if (result.status === 0) {
    rows.push([demo.ecosystem, demo.status, 'ok']);
  } else {
    process.stdout.write(result.stderr ?? '');
    failures += 1;
    rows.push([demo.ecosystem, demo.status, 'FAILED verification']);
  }
}

process.stdout.write('\nSummary:\n');
const width = Math.max(...rows.map(([e]) => e.length), 9);
for (const [eco, status, note] of rows) {
  process.stdout.write(`  ${eco.padEnd(width)}  ${status.padEnd(18)}  ${note}\n`);
}

if (failures > 0) {
  process.stderr.write(`\n${failures} problem${failures === 1 ? '' : 's'} found.\n`);
  process.exit(1);
}
process.stdout.write('\nAll structural checks passed.\n');
