// Read the declared version of one dependency from a demo's primary manifest.
//
// This is deliberately small and text-based. Demo fixtures pin exact versions
// (see the fixture contract in the README), so a full manifest parser per
// ecosystem would be more code and more dependencies for no extra signal. Each
// reader returns the version string as written, or throws with a message that
// names the file and the dependency it could not find.
//
// It is used by verify-demo.mjs to assert two facts: the committed baseline is
// at `fromVersion`, and the patched tree is at `toVersion`.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} ecosystem  Drift ecosystem id
 * @param {string} demoDir    absolute path to the demo directory
 * @param {string} dependency registry name / module path of the dependency
 * @param {string[]} dependencyFiles  demo-relative manifest paths, primary first
 * @returns {string} the version string exactly as declared
 */
export function readDeclaredVersion(ecosystem, demoDir, dependency, dependencyFiles) {
  const reader = READERS[ecosystem];
  if (!reader) {
    throw new Error(`no baseline-version reader implemented for ecosystem "${ecosystem}"`);
  }
  const primary = dependencyFiles[0];
  const text = readFileSync(join(demoDir, primary), 'utf8');
  const version = reader(text, dependency);
  if (!version) {
    throw new Error(`could not find a declared version for "${dependency}" in ${primary}`);
  }
  return version;
}

const READERS = {
  npm(text, dependency) {
    const pkg = JSON.parse(text);
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      const spec = pkg?.[field]?.[dependency];
      if (typeof spec === 'string') return stripRange(spec);
    }
    return null;
  },

  pypi(text, dependency) {
    // Matches `name==1.2.3` in requirements.txt or a pyproject dependency array,
    // tolerating extras (`name[x]`) and surrounding quotes/whitespace.
    const escaped = escapeRegExp(dependency);
    const match = text.match(new RegExp(`["']?${escaped}(?:\\[[^\\]]*\\])?\\s*==\\s*([0-9][^"'\\s,;]*)`, 'i'));
    return match ? match[1] : null;
  },

  go(text, dependency) {
    const escaped = escapeRegExp(dependency);
    const match = text.match(new RegExp(`^\\s*(?:require\\s+)?${escaped}\\s+(v[0-9][^\\s/]*)`, 'm'));
    return match ? match[1] : null;
  },

  cargo(text, dependency) {
    const escaped = escapeRegExp(dependency);
    // `name = "1.2.3"` or `name = { version = "1.2.3", ... }` or `name.version = "1.2.3"`.
    // A leading `=`, `^`, `~` or `>=`/`<=` requirement operator is not part of the version.
    const clean = (v) => v.replace(/^\s*(>=|<=|=|\^|~|>|<)?\s*/, '').trim();
    const inline = text.match(new RegExp(`^\\s*${escaped}\\s*=\\s*"([^"]+)"`, 'm'));
    if (inline) return clean(inline[1]);
    const table = text.match(new RegExp(`^\\s*${escaped}\\s*=\\s*\\{[^}]*?version\\s*=\\s*"([^"]+)"`, 'm'));
    if (table) return clean(table[1]);
    const dotted = text.match(new RegExp(`^\\s*${escaped}\\.version\\s*=\\s*"([^"]+)"`, 'm'));
    return dotted ? clean(dotted[1]) : null;
  },

  maven(text, dependency) {
    // `dependency` is `groupId:artifactId`. Find the <dependency> block whose
    // <artifactId> matches and read its <version>.
    const [, artifactId] = dependency.includes(':') ? dependency.split(':') : [null, dependency];
    const blocks = text.match(/<dependency>[\s\S]*?<\/dependency>/g) ?? [];
    for (const block of blocks) {
      const a = block.match(/<artifactId>\s*([^<\s]+)\s*<\/artifactId>/);
      if (a && a[1] === artifactId) {
        const v = block.match(/<version>\s*([^<\s]+)\s*<\/version>/);
        if (v) return v[1];
      }
    }
    return null;
  },
};

function stripRange(spec) {
  return spec.replace(/^[\s^~>=<]+/, '').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}
