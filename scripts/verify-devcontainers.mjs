#!/usr/bin/env node
// Check every devcontainer against demos.json.
//
//   node scripts/verify-devcontainers.mjs
//
// Each ecosystem's devcontainer hides the *other* demos from the Explorer with
// `files.exclude`. That list is static, so adding a sixth demo would silently
// leave it visible in the five existing environments — the kind of rot nothing
// reports. This turns it into a failing check.
//
// It also asserts the things a demo Codespace must not lose: the published
// extension id, a creation-time (not resume-time) prepare step, and the three
// files the demo opens.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, loadDemosConfig, readExpected } from './lib/demo-config.mjs';

/** Strip comments from JSONC so JSON.parse can read a devcontainer file. */
function parseJsonc(text) {
  const withoutBlock = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const withoutLine = withoutBlock.replace(/(^|[^:"])\/\/.*$/gm, '$1');
  return JSON.parse(withoutLine);
}

const { demos } = loadDemosConfig();
const problems = [];
const note = (ok, label) => {
  process.stdout.write(`  ${ok ? '✓' : '✗'} ${label}\n`);
  if (!ok) problems.push(label);
};

for (const demo of demos) {
  const path = join(REPO_ROOT, demo.devcontainerPath);
  process.stdout.write(`\n${demo.ecosystem} (${demo.devcontainerPath})\n`);

  if (!existsSync(path)) {
    // A demo with no fixture yet is allowed to have no devcontainer yet.
    const hasFixture = existsSync(join(REPO_ROOT, demo.demoPath));
    note(!hasFixture, hasFixture ? 'devcontainer exists' : 'no devcontainer yet (no fixture either)');
    continue;
  }

  let config;
  try {
    config = parseJsonc(readFileSync(path, 'utf8'));
  } catch (error) {
    note(false, `parses as JSONC — ${error.message}`);
    continue;
  }

  const vscode = config.customizations?.vscode ?? {};

  note(
    (vscode.extensions ?? []).includes('drift.drift'),
    'installs the published drift.drift extension',
  );

  // Creation-time, not resume-time: reopening a Codespace must not re-apply the
  // patch over the visitor's own edits.
  const create = config.onCreateCommand;
  note(typeof create === 'string' && create.length > 0, 'has an onCreateCommand');
  note(
    config.postStartCommand === undefined && config.postAttachCommand === undefined,
    'does not prepare on resume (no postStartCommand / postAttachCommand)',
  );
  note(config.waitFor === 'onCreateCommand', 'waitFor is onCreateCommand');
  if (typeof create === 'string') {
    const prepares =
      create.includes(`prepare-demo.mjs ${demo.ecosystem}`) || create.includes('setup.sh');
    note(prepares, `creation step prepares the ${demo.ecosystem} fixture`);
  }

  // The Explorer should show this demo and hide the others — exactly.
  const excluded = Object.entries(vscode.settings?.['files.exclude'] ?? {})
    .filter(([, on]) => on === true)
    .map(([k]) => k)
    .sort();
  const expectedExcluded = demos
    .filter((d) => d.ecosystem !== demo.ecosystem)
    .map((d) => d.demoPath)
    .sort();
  note(
    JSON.stringify(excluded) === JSON.stringify(expectedExcluded),
    `hides exactly the other ${expectedExcluded.length} demo(s)` +
      (JSON.stringify(excluded) === JSON.stringify(expectedExcluded)
        ? ''
        : `\n      excludes: ${excluded.join(', ') || 'nothing'}\n      expected: ${expectedExcluded.join(', ')}`),
  );

  // Opens DEMO.md, the affected source, and the manifest.
  const open = config.customizations?.codespaces?.openFiles ?? [];
  const expected = readExpected(demo);
  const wanted = [
    `${demo.demoPath}/DEMO.md`,
    `${demo.demoPath}/${expected.expectedAffectedFiles[0]}`,
    `${demo.demoPath}/${expected.dependencyFiles[0]}`,
  ];
  note(JSON.stringify(open) === JSON.stringify(wanted), `opens DEMO.md, affected source, manifest`);
}

process.stdout.write('\n');
if (problems.length > 0) {
  process.stderr.write(`${problems.length} devcontainer problem(s).\n`);
  process.exit(1);
}
process.stdout.write('All devcontainers agree with demos.json.\n');
