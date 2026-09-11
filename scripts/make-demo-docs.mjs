#!/usr/bin/env node
// Write demos/<eco>/DEMO.md from demo.json plus the BREAKING comments in the
// demo's own source. Generated so the guide can never drift from the code.
//
//   node scripts/make-demo-docs.mjs [--check]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { REPO_ROOT, allDemos } from './lib/demo-config.mjs';

const checkOnly = process.argv.includes('--check');
let stale = 0;

for (const demo of allDemos()) {
  const sourceFile = demo.open[0];
  const source = readFileSync(join(REPO_ROOT, demo.dir, sourceFile), 'utf8');

  // Each break is marked "── BREAKING n ──" followed by comment lines
  // explaining it. Pull those out so the guide lists the real ones.
  const breaks = [];
  const lines = source.split('\n');
  // `#` only counts as a comment marker when it is followed by whitespace or
  // nothing — otherwise it matches C/C++ preprocessor directives (`#define`,
  // `#include`) immediately following a `//`-comment BREAKING block, and those
  // get swallowed into the explanation text instead of ending it.
  const COMMENT_LINE = /^\s*(\/\/|#(?=\s|$)|--)/;
  for (let i = 0; i < lines.length; i += 1) {
    // The marker is a ruled comment line: `── BREAKING ──` or `── BREAKING 2 ──`.
    if (!/──\s*BREAKING(\s+\d+)?\s*──/.test(lines[i])) continue;
    // Consume the explanation that follows the marker. Line-comment languages
    // end it at the first non-comment or blank line; OCaml's block comments
    // have no per-line marker, so there the block ends at `*)`.
    const blockComment = !COMMENT_LINE.test(lines[i + 1] ?? '');
    const text = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      const raw = lines[j];
      const closes = blockComment && /\*\)/.test(raw);
      if (!blockComment && (!COMMENT_LINE.test(raw) || raw.trim().replace(/^\s*(\/\/|#|--)\s?/, '') === '')) break;
      const stripped = raw
        .replace(/\*\)\s*$/, '')
        .replace(/^\s*(\/\/|#|--|\(\*)?\s?/, '')
        .replace(/─+/g, '')
        .trim();
      if (stripped !== '') text.push(stripped);
      if (closes || stripped === '') break;
    }
    if (text.length) breaks.push(text.join(' ').replace(/\s+/g, ' ').trim());
  }

  const body = `# Try Drift — ${demo.label}

This project depends on \`${demo.dependency}\` **${demo.from}**.

The Codespace upgraded it to **${demo.to}** and left the source code alone, so
\`${sourceFile}\` is now written against an API that no longer exists. That is
the situation Drift is built to analyse.

${breaks.length === 1 ? 'The breaking change' : `The ${breaks.length} breaking changes`} in this demo:

${breaks.map((b, i) => `${i + 1}. ${b}`).join('\n')}

## Try it

Both halves of Drift started on their own when this Codespace opened:

- the **panel** on the left, which analysed the change and lists what it found;
- the **terminal**, which ran \`drift analyze\` from the repository root, where
  this demo's manifest is the only changed one.

If VS Code asks whether you trust the authors of the files in this folder, say
yes. It asks before anything is allowed to run, so until it is answered both
the panel and the terminal stay empty — and the files it is asking about are
this repository's own demo fixture.

From there:

1. Read what Drift found for \`${demo.dependency}\` in the panel.
2. Open \`${sourceFile}\` and compare against the marked lines.
3. Click a finding to jump to the code it affects.

Nothing here is staged output — Drift is analysing an ordinary uncommitted
dependency change, and it has no idea this is a demo:

\`\`\`sh
git status --short     # only the manifest is modified; the source is untouched
\`\`\`

Run it again yourself, or ask a different question:

\`\`\`sh
drift analyze                    # what this upgrade breaks here
drift explain ${demo.dependency}
\`\`\`

Run these from the repository root — the demo's manifest is the only changed
one, so there is nothing to point them at.

Reset it with \`node scripts/reset-demo.mjs ${demo.ecosystem}\`.
`;

  const target = join(REPO_ROOT, demo.dir, 'DEMO.md');
  const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
  if (current === body) continue;
  if (checkOnly) {
    stale += 1;
    process.stdout.write(`  ✗ ${demo.dir}/DEMO.md is stale\n`);
    continue;
  }
  writeFileSync(target, body);
  process.stdout.write(`  ✓ ${demo.dir}/DEMO.md (${breaks.length} breaking changes)\n`);
}

if (checkOnly && stale > 0) {
  process.stderr.write(`\n${stale} DEMO.md file(s) out of date — run: node scripts/make-demo-docs.mjs\n`);
  process.exit(1);
}
