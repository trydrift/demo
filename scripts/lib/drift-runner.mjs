// Run published Drift against a prepared fixture and check its machine-readable
// output against the fixture's expected.json.
//
// Until `@usedrift/cli` is published this module resolves to "unavailable" and
// the semantic layer of verify-all.mjs prints SKIPPED. The assertion logic
// below is written against the real shape of `drift analyze --json`
// (schemaVersion 3: `changes`, `breakingChanges`, `impactSites`, `dispositions`)
// so that turning it on is a one-line change, not a rewrite.

import { spawnSync } from 'node:child_process';

import { REPO_ROOT } from './demo-config.mjs';

/** The package that provides the `drift` binary. Do not point this elsewhere. */
export const DRIFT_CLI_PACKAGE = '@usedrift/cli';

/**
 * Decide how (or whether) to invoke Drift.
 *
 *   DRIFT_CLI=/path/to/drift   explicit binary, used as-is
 *   otherwise                  `drift` on PATH, only if `drift --version` works
 *
 * `npx @usedrift/cli` is deliberately NOT attempted: the package is unpublished,
 * so an implicit install would fail slowly and confusingly. Once it ships, add
 * an `npm i -g @usedrift/cli` step to the workflow (or set DRIFT_CLI).
 *
 * @returns {{ available: true, command: string, version: string }
 *          | { available: false, reason: string }}
 */
export function resolveDriftCli() {
  const explicit = process.env.DRIFT_CLI?.trim();
  const command = explicit || 'drift';
  const probe = spawnSync(command, ['--version'], { encoding: 'utf8' });
  if (probe.status !== 0) {
    return {
      available: false,
      reason: explicit
        ? `DRIFT_CLI="${explicit}" is not runnable (${probe.error?.message ?? `exit ${probe.status}`})`
        : `Drift CLI not published (${DRIFT_CLI_PACKAGE})`,
    };
  }
  return { available: true, command, version: probe.stdout.trim() };
}

/**
 * Run `drift analyze --json` from the repository root (the whole repo, the way
 * the extension sees it) and return the parsed plan.
 */
export function runDriftAnalyze(command) {
  const result = spawnSync(command, ['analyze', '--json'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (!result.stdout) {
    throw new Error(`drift analyze produced no output (exit ${result.status}): ${firstLine(result.stderr)}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`drift analyze output was not JSON: ${error.message}`);
  }
}

/**
 * Compare two spellings of the same release.
 *
 * This normalises only *representational* differences and then compares
 * exactly. It must never accept two genuinely different releases: an earlier
 * version of this function compared component-by-component over
 * `Math.min(a.length, b.length)`, which made `1.2` and `1.2.999` equal — so a
 * fixture could silently drift onto the wrong release and still pass.
 *
 * The two differences that are real and must be tolerated:
 *   - a leading `v`, because Go writes `v1.2.3` and npm writes `1.2.3`;
 *   - zero-padding of the numeric core, because a pom.xml says `20.0` where
 *     Drift's normalised form says `20.0.0`.
 *
 * Everything else — prerelease tags, Go pseudo-version timestamps and hashes,
 * build metadata — is preserved and compared exactly.
 */
function versionsMatch(a, b) {
  const canonical = (value) => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim().replace(/^v/, '');
    // Split off prerelease (`-...`) and build metadata (`+...`) from the core.
    const match = text.match(/^(\d+(?:\.\d+)*)(?:-([^+]*))?(?:\+(.*))?$/);
    if (!match) return text; // not a dotted-numeric version; compare verbatim
    const [, core, prerelease = '', build = ''] = match;
    const parts = core.split('.');
    while (parts.length < 3) parts.push('0'); // 20.0 -> 20.0.0
    while (parts.length > 3 && parts.at(-1) === '0') parts.pop(); // 1.2.3.0 -> 1.2.3
    return `${parts.map((p) => String(Number(p))).join('.')}${prerelease ? `-${prerelease}` : ''}${build ? `+${build}` : ''}`;
  };

  const x = canonical(a);
  const y = canonical(b);
  return x !== null && y !== null && x === y;
}

/**
 * Compare a `drift analyze --json` plan against one fixture's expectation.
 *
 * @param {object} plan      parsed `drift analyze --json`
 * @param {object} expected  the fixture's expected.json
 * @param {object} demo      the demos.json entry (for demoPath)
 * @returns {{ ok: boolean, checks: Array<{label: string, ok: boolean, detail?: string}> }}
 */
export function assertExpectations(plan, expected, demo) {
  const checks = [];
  const add = (label, ok, detail) => checks.push({ label, ok, detail });
  /** Record something observed but deliberately not asserted. Never counts as a pass. */
  const skip = (label) => checks.push({ label, ok: true, skipped: true });

  const change = (plan.changes ?? []).find(
    (c) => c.name === expected.dependency && c.workspace === demo.demoPath,
  );
  add(`change reported for ${expected.dependency}`, Boolean(change));

  if (change) {
    add(
      `from ${expected.fromVersion}`,
      versionsMatch(change.from, expected.fromVersion) || versionsMatch(change.rawFrom, expected.fromVersion),
      `plan: ${change.from}`,
    );
    add(
      `to ${expected.toVersion}`,
      versionsMatch(change.to, expected.toVersion) || versionsMatch(change.rawTo, expected.toVersion),
      `plan: ${change.to}`,
    );
  }

  // An `evidence-only` fixture asserts a different, weaker — but still
  // concrete — artifact: Drift has no API surface to diff for this ecosystem
  // (Ruby, PHP, Swift, OCaml, CocoaPods all declare `surface: none`), so the
  // honest result is prose evidence plus a recommendation, not a located call
  // site. That is asserted here rather than waved through.
  if (expected.demoKind === 'evidence-only') {
    const rationale = (plan.rationale ?? []).find((r) => r.dependency === expected.dependency);
    add(`rationale reported for ${expected.dependency}`, Boolean(rationale));

    const breakingNotes = (rationale?.summary?.changes ?? []).filter((c) => c.category === 'breaking');
    const wantNotes = expected.expectedEvidence?.minBreakingNotes ?? 1;
    add(
      `at least ${wantNotes} breaking evidence item(s) cited`,
      breakingNotes.length >= wantNotes,
      `saw ${breakingNotes.length}`,
    );
    add(
      'every cited breaking item carries a source URL',
      breakingNotes.length > 0 && breakingNotes.every((c) => typeof c.url === 'string' && c.url.length > 0),
    );

    const wantRec = expected.expectedEvidence?.recommendationIn;
    if (Array.isArray(wantRec) && wantRec.length > 0) {
      const got = rationale?.assessment?.recommendation;
      add(`recommendation is one of ${wantRec.join(', ')}`, wantRec.includes(got), `got ${got}`);
    }

    // State the absence explicitly so it can never read as an oversight.
    skip(
      `no API-surface diff for ${expected.ecosystem} by design — ` +
        `${(plan.breakingChanges ?? []).filter((b) => b.dependency === expected.dependency).length} structured finding(s)`,
    );
    return { ok: checks.filter((c) => !c.skipped).every((c) => c.ok), checks };
  }

  const breaking = (plan.breakingChanges ?? []).filter(
    (b) => b.dependency === expected.dependency && b.workspace === demo.demoPath,
  );
  add(`at least one breaking change on ${expected.dependency}`, breaking.length > 0);

  if (Array.isArray(expected.expectedChangeKinds) && expected.expectedChangeKinds.length > 0) {
    const kinds = new Set(breaking.map((b) => b.kind));
    const hit = expected.expectedChangeKinds.find((k) => kinds.has(k));
    add(`change kind is one of ${expected.expectedChangeKinds.join(', ')}`, Boolean(hit), `saw: ${[...kinds].join(', ')}`);
  }

  if (Array.isArray(expected.expectedSymbols) && expected.expectedSymbols.length > 0) {
    const symbols = breaking.flatMap((b) => b.symbols ?? []);
    const hit = expected.expectedSymbols.find((want) =>
      symbols.some((s) => s === want || s.endsWith(`.${want}`) || s.endsWith(`::${want}`)),
    );
    add(`names one of ${expected.expectedSymbols.join(', ')}`, Boolean(hit), `saw: ${symbols.join(', ') || 'none'}`);
  }

  const siteMatches = (site, f) => site.file === `${demo.demoPath}/${f}` || site.file.endsWith(`/${f}`);
  const sites = (plan.impactSites ?? []).filter((s) =>
    (expected.expectedAffectedFiles ?? []).some((f) => siteMatches(s, f)),
  );

  if (expected.expectsAffectedCallSite) {
    for (const f of expected.expectedAffectedFiles ?? []) {
      const hasFileSite = (plan.impactSites ?? []).some((s) => siteMatches(s, f));
      add(`impact site in ${f}`, hasFileSite, hasFileSite ? undefined : 'no localized site');
    }
    add('at least one localized impact site', sites.length > 0);
  } else {
    // The fixture does not claim Drift localizes this one. Report what actually
    // happened, but never manufacture a passing check out of an untested claim:
    // an earlier version recorded `add(..., true)` here, so a demo could assert
    // an affected file, get no localization at all, and still show green.
    skip(
      `localization not asserted (expectsAffectedCallSite: false) — Drift reported ` +
        `${sites.length} site(s) in ${(expected.expectedAffectedFiles ?? []).join(', ') || 'the declared files'}`,
    );
  }

  // `ok` deliberately ignores skipped entries rather than counting them as passes.
  return { ok: checks.filter((c) => !c.skipped).every((c) => c.ok), checks };
}

function firstLine(text) {
  return String(text ?? '').split('\n')[0];
}
