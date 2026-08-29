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

/** Loose version compare: ignore a leading `v` and any `.0` padding difference. */
function versionsMatch(a, b) {
  const norm = (v) =>
    String(v)
      .replace(/^v/, '')
      .replace(/\+.*$/, '')
      .split(/[.-]/)
      .filter(Boolean);
  const x = norm(a);
  const y = norm(b);
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i += 1) if (x[i] !== y[i]) return false;
  return true;
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

  const sites = (plan.impactSites ?? []).filter((s) =>
    (expected.expectedAffectedFiles ?? []).some((f) => s.file === `${demo.demoPath}/${f}` || s.file.endsWith(`/${f}`)),
  );
  for (const f of expected.expectedAffectedFiles ?? []) {
    const hasFileSite = (plan.impactSites ?? []).some((s) => s.file === `${demo.demoPath}/${f}` || s.file.endsWith(`/${f}`));
    if (expected.expectsAffectedCallSite) {
      add(`impact site in ${f}`, hasFileSite, hasFileSite ? undefined : 'no localized site');
    } else {
      add(`${f} listed as affected file (call site not required)`, true);
    }
  }

  if (expected.expectsAffectedCallSite) {
    add('at least one localized impact site', sites.length > 0);
  }

  return { ok: checks.every((c) => c.ok), checks };
}

function firstLine(text) {
  return String(text ?? '').split('\n')[0];
}
