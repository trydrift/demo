#!/usr/bin/env node
// Apply a demo's dependency upgrade, leaving the source code alone.
//
//   node scripts/prepare-demo.mjs <ecosystem>
//
// This is what the Codespace runs once at creation. It edits only the manifest,
// so the working tree ends up as: new dependency version, old source code,
// uncommitted — which is what Drift analyses.
//
// Running it twice is harmless.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, fail, readDemo, readEcosystemArg } from './lib/demo-config.mjs';

const demo = readDemo(readEcosystemArg('prepare-demo.mjs'));

let changed = 0;
let already = 0;

for (const edit of demo.edits) {
  const path = join(REPO_ROOT, demo.dir, edit.file);
  const before = readFileSync(path, 'utf8');

  if (before.includes(edit.replace) && !before.includes(edit.find)) {
    already += 1;
    continue;
  }
  if (!before.includes(edit.find)) {
    fail(`${demo.dir}/${edit.file} does not contain the expected text:\n  ${edit.find}`);
  }
  writeFileSync(path, before.split(edit.find).join(edit.replace));
  changed += 1;
}

if (changed === 0 && already > 0) {
  process.stdout.write(`✓ ${demo.ecosystem} demo already prepared — ${demo.dependency} ${demo.from} → ${demo.to}\n`);
} else {
  process.stdout.write(
    `✓ ${demo.ecosystem} demo prepared — ${demo.dependency} ${demo.from} → ${demo.to}\n` +
      `  changed: ${demo.edits.map((e) => e.file).join(', ')}\n` +
      `  source code: untouched\n`,
  );
}
