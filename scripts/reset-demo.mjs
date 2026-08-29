#!/usr/bin/env node
// Put a demo's manifest back to its committed version.
//
//   node scripts/reset-demo.mjs <ecosystem>
//
// Restores only the files the upgrade touches. Anything else you changed in the
// demo — including the source you were experimenting with — is left alone.

import { git, readDemo, readEcosystemArg } from './lib/demo-config.mjs';

const demo = readDemo(readEcosystemArg('reset-demo.mjs'));

for (const edit of demo.edits) {
  git(['checkout', 'HEAD', '--', `${demo.dir}/${edit.file}`]);
}

process.stdout.write(`✓ ${demo.ecosystem} demo reset — back to ${demo.dependency} ${demo.from}\n`);
