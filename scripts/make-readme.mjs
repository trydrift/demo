#!/usr/bin/env node
// Regenerate the demo table in README.md from the demos themselves, so the
// versions and the launch links cannot drift from what is committed.
//
//   node scripts/make-readme.mjs [--check]

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, allDemos } from './lib/demo-config.mjs';

const START = '<!-- demos:start -->';
const END = '<!-- demos:end -->';

/** Go pseudo-versions are unreadable in a table; show the date they encode. */
function short(version) {
  const pseudo = version.match(/^v0\.0\.0-(\d{4})(\d{2})(\d{2})\d{6}-[0-9a-f]+$/);
  return pseudo ? `${pseudo[1]}-${pseudo[2]}-${pseudo[3]}` : version;
}

const rows = allDemos().map((demo) => {
  const path = encodeURIComponent(`.devcontainer/${demo.ecosystem}/devcontainer.json`);
  const url = `https://codespaces.new/trydrift/demo?quickstart=1&devcontainer_path=${path}`;
  return `| \`${demo.ecosystem}\` | ${demo.label} | \`${demo.dependency}\` | ${short(demo.from)} → ${short(demo.to)} | [Open](${url}) |`;
});

const table = [
  START,
  '',
  '| Ecosystem | Language | Dependency | Upgrade | Try |',
  '| --- | --- | --- | --- | --- |',
  ...rows,
  '',
  END,
].join('\n');

const path = join(REPO_ROOT, 'README.md');
const current = readFileSync(path, 'utf8');
const updated = current.replace(new RegExp(`${START}[\\s\\S]*?${END}`), table);

if (updated === current) {
  process.stdout.write('README table is up to date.\n');
  process.exit(0);
}
if (process.argv.includes('--check')) {
  process.stderr.write('README demo table is out of date — run: node scripts/make-readme.mjs\n');
  process.exit(1);
}
writeFileSync(path, updated);
process.stdout.write(`✓ README demo table (${rows.length} demos)\n`);
