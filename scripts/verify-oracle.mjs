#!/usr/bin/env node
// Prove that a fixture's break is real, using the ecosystem's own toolchain.
//
//   node scripts/verify-oracle.mjs <ecosystem>
//
// Structural validation only proves "old manifest → patch applies → new
// manifest, source untouched". That says nothing about whether the code
// actually works before the upgrade and actually breaks after it — which is
// the entire claim a demo makes. Two fixtures shipped with that claim wrong
// because nothing executed them.
//
// So this runs the fixture's own `oracle.command` twice:
//
//   1. against the committed baseline  → must SUCCEED (exit 0)
//   2. against the upgraded tree       → must FAIL, and the output must match
//                                        `oracle.expectedFailurePattern`
//
// Requiring the failure to *match a pattern* matters: a fixture whose oracle
// fails for an unrelated reason (a typo, a missing toolchain, a network error)
// would otherwise look like a proven break.
//
// This needs the real toolchain for the ecosystem, so it runs in a per-language
// CI matrix rather than in the fast structural job.

import { spawnSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, fail, getDemo, readEcosystemArg, readExpected } from './lib/demo-config.mjs';

const ecosystem = readEcosystemArg('verify-oracle.mjs');
const demo = getDemo(ecosystem);
const expected = readExpected(demo);
const demoDir = join(REPO_ROOT, demo.demoPath);

const oracle = expected.oracle;
if (!oracle?.command || !oracle?.expectedFailurePattern) {
  fail(
    `${demo.demoPath}/.drift-demo/expected.json: "oracle" must set "command" and ` +
      '"expectedFailurePattern". Every fixture must be able to prove its own break.',
  );
}
const failurePattern = new RegExp(oracle.expectedFailurePattern);

process.stdout.write(`Oracle for ${ecosystem} (${demo.label})\n  command: ${oracle.command}\n\n`);

cleanGenerated();
run('node', ['scripts/reset-demo.mjs', ecosystem], REPO_ROOT, { quiet: true });

// --- 1. baseline must succeed ------------------------------------------------
process.stdout.write('1. baseline (pre-upgrade) — expecting success\n');
const baseline = runOracle();
if (baseline.status !== 0) {
  cleanGenerated();
  fail(
    `  ✗ the committed baseline does NOT work (exit ${baseline.status}).\n` +
      '    A fixture must be valid against its old dependency version.\n' +
      indent(baseline.output),
  );
}
process.stdout.write(`  ✓ baseline succeeds (exit 0)\n\n`);

// --- 2. upgraded must fail, for the stated reason ----------------------------
cleanGenerated();
run('node', ['scripts/prepare-demo.mjs', ecosystem], REPO_ROOT, { quiet: true });

process.stdout.write('2. upgraded — expecting failure matching /' + oracle.expectedFailurePattern + '/\n');
const upgraded = runOracle();

let problem = null;
if (upgraded.status === 0) {
  problem =
    '  ✗ the upgraded tree still SUCCEEDS. This fixture does not represent a real\n' +
    '    breaking change — the upgrade does not break this source code.';
} else if (!failurePattern.test(upgraded.output)) {
  problem =
    `  ✗ the upgraded tree failed (exit ${upgraded.status}) but not for the stated reason.\n` +
    `    Expected output matching /${oracle.expectedFailurePattern}/.\n` +
    indent(upgraded.output);
}

// Always restore the fixture, whatever the verdict.
cleanGenerated();
run('node', ['scripts/reset-demo.mjs', ecosystem], REPO_ROOT, { quiet: true });

if (problem) fail(problem);

process.stdout.write(`  ✓ upgraded fails as stated (exit ${upgraded.status})\n`);
process.stdout.write(`    ${firstMatchingLine(upgraded.output, failurePattern)}\n\n`);
process.stdout.write(`✓ ${ecosystem}: break independently proven by the ecosystem's own toolchain\n`);

// ---------------------------------------------------------------------------

function runOracle() {
  const result = spawnSync('bash', ['-lc', oracle.command], {
    cwd: demoDir,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  return { status: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

/** Remove build/install output the oracle creates, so each run starts clean. */
function cleanGenerated() {
  for (const rel of expected.generatedFiles ?? []) {
    const target = join(demoDir, rel);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
}

function run(command, args, cwd, { quiet = false } = {}) {
  const r = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) fail(`${command} ${args.join(' ')} failed:\n${indent((r.stderr || r.stdout) ?? '')}`);
  if (!quiet) process.stdout.write(r.stdout ?? '');
  return r;
}

function firstMatchingLine(output, pattern) {
  return output.split('\n').find((l) => pattern.test(l))?.trim() ?? '(matched)';
}

function indent(text) {
  return String(text ?? '')
    .split('\n')
    .slice(0, 25)
    .map((l) => `      ${l}`)
    .join('\n');
}
