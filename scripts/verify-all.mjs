#!/usr/bin/env node
// Validate every demo fixture — structure always, semantics when Drift is
// published. This is what the verify-demos.yml workflow runs.
//
//   node scripts/verify-all.mjs
//
// Structural pass (per demo, must pass before publication):
//   runs scripts/verify-demo.mjs <ecosystem> — baseline version, patch applies
//   and touches only dependency metadata, source untouched, patched version,
//   reset restores the baseline.
//
// Semantic pass (per demo, only when `@usedrift/cli` resolves):
//   prepare the fixture, run `drift analyze --json`, compare against
//   expected.json (dependency, from/to, breaking-change kind and symbol,
//   localized impact sites), reset the fixture.

import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, loadDemosConfig, readExpected } from './lib/demo-config.mjs';
import { resolveDriftCli, runDriftAnalyze, assertExpectations } from './lib/drift-runner.mjs';

const { demos } = loadDemosConfig();
const cli = resolveDriftCli();

process.stdout.write(`.drift-demo/demos.json valid — ${demos.length} demo(s)\n`);
process.stdout.write(
  cli.available
    ? `Drift CLI: ${cli.command} (${cli.version}) — semantic checks ENABLED\n\n`
    : `Drift CLI: ${cli.reason} — semantic checks SKIPPED\n\n`,
);

let failures = 0;
const rows = [];

for (const demo of demos) {
  const present = existsSync(join(REPO_ROOT, demo.demoPath)) && statSync(join(REPO_ROOT, demo.demoPath)).isDirectory();
  if (!present) {
    if (demo.status === 'not-yet-validated') {
      rows.push([demo.ecosystem, 'pending', 'no fixture yet']);
    } else {
      failures += 1;
      rows.push([demo.ecosystem, 'FAIL', 'exposed demo has no fixture']);
    }
    continue;
  }

  // --- structural -------------------------------------------------------------
  const structural = spawnSync('node', ['scripts/verify-demo.mjs', demo.ecosystem], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  process.stdout.write(structural.stdout ?? '');
  if (structural.status !== 0) {
    process.stdout.write(structural.stderr ?? '');
    failures += 1;
    rows.push([demo.ecosystem, 'FAIL', 'structural verification']);
    continue;
  }

  if (!cli.available) {
    rows.push([demo.ecosystem, 'ok', 'structure only']);
    continue;
  }

  // --- semantic ------------------------------------------------------------
  const expected = readExpected(demo);
  let semanticOk = false;
  let note = '';
  try {
    run('node', ['scripts/prepare-demo.mjs', demo.ecosystem]);
    const plan = runDriftAnalyze(cli.command);
    const { ok, checks } = assertExpectations(plan, expected, demo);
    process.stdout.write(`\nSemantic (${demo.ecosystem}):\n`);
    for (const c of checks) {
      process.stdout.write(`  ${c.ok ? '✓' : '✗'} ${c.label}${c.detail ? ` — ${c.detail}` : ''}\n`);
    }
    semanticOk = ok;
    note = ok ? 'structure + semantics' : 'semantic mismatch';
  } catch (error) {
    note = `semantic error: ${error.message}`;
  } finally {
    run('node', ['scripts/reset-demo.mjs', demo.ecosystem]);
  }

  // A semantic mismatch is only a CI failure for a demo the website exposes.
  // `not-yet-validated` demos are, by definition, not yet guaranteed to produce
  // the full Drift result — the mismatch is surfaced as a warning instead.
  const enforced = demo.status === 'interactive' || demo.status === 'evidence-only';
  if (!semanticOk && enforced) failures += 1;
  rows.push([
    demo.ecosystem,
    semanticOk ? 'ok' : enforced ? 'FAIL' : 'warn',
    semanticOk ? note : `${note} (status: ${demo.status})`,
  ]);
}

process.stdout.write('\nSummary:\n');
const w = Math.max(...rows.map((r) => r[0].length), 8);
for (const [eco, state, note] of rows) {
  process.stdout.write(`  ${eco.padEnd(w)}  ${state.padEnd(8)}  ${note}\n`);
}

if (failures > 0) {
  process.stderr.write(`\n${failures} problem(s) found.\n`);
  process.exit(1);
}
process.stdout.write('\nAll demo checks passed.\n');

function run(command, args) {
  const r = spawnSync(command, args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (r.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed: ${(r.stderr || r.stdout || '').trim()}`);
  }
  return r;
}
