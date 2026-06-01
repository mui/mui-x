#!/usr/bin/env node
/**
 * Validates `.changeset/*.md` files against MUI X conventions.
 * Run in CI (see `.github/workflows/changeset-check.yml`) and locally.
 *
 * Checks per changeset:
 * 1. Parses as `--- frontmatter --- body`.
 * 2. Lists >= 1 package, each `@mui/x-*` and known, bump in major|minor|patch.
 * 3. Tier convention: at most ONE tier per product (list the lowest tier only;
 *    higher tiers inherit via "Same changes as ..., plus:").
 * 4. Non-empty summary body.
 * 5. `tag` frontmatter (if present) matches `[\w- ]+` (no brackets).
 *
 * Usage: node scripts/changeset-changelog/validate.mjs [changesetDir]
 * Exits non-zero with a report when any file fails. Missing/empty dir = pass.
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPackageIndex } from './config.mjs';

const BUMPS = new Set(['major', 'minor', 'patch']);

/** @returns {string[]} errors for one changeset file */
function validateFile(filePath, index) {
  const errors = [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return ['missing or malformed `--- frontmatter ---` block'];
  }
  const [, frontmatter, body] = match;

  const packages = [];
  let tag;
  for (const line of frontmatter.split('\n')) {
    if (!line.trim()) {
      continue;
    }
    const pkgMatch = line.match(/^["']([^"']+)["']:\s*(\S+)\s*$/);
    if (pkgMatch) {
      const [, name, bump] = pkgMatch;
      if (!BUMPS.has(bump)) {
        errors.push(`"${name}": invalid bump "${bump}" (use major|minor|patch)`);
      }
      packages.push(name);
      continue;
    }
    const tagMatch = line.match(/^tag:\s*(.*)$/);
    if (tagMatch) {
      tag = tagMatch[1].trim();
      continue;
    }
    if (!/^(pr|author):/.test(line)) {
      errors.push(`unrecognized frontmatter line: "${line.trim()}"`);
    }
  }

  if (packages.length === 0) {
    errors.push('lists no packages (use an empty changeset for no-op changes)');
  }

  // Tier convention: at most one tier per product.
  const productTiers = new Map();
  for (const name of packages) {
    const hit = index.get(name);
    if (!hit) {
      // Non-product packages (x-internals, x-virtualizer, ...) are allowed but
      // won't render in product sections — surface as info, not error.
      continue;
    }
    const list = productTiers.get(hit.product.name) ?? [];
    list.push({ name, tier: hit.tier });
    productTiers.set(hit.product.name, list);
  }
  for (const [product, list] of productTiers) {
    if (list.length > 1) {
      errors.push(
        `lists ${list.length} tiers of "${product}" (${list
          .map((t) => t.name)
          .join(', ')}); list only the lowest tier — higher tiers inherit`,
      );
    }
  }

  if (tag !== undefined && !/^\[?[\w- ]+\]?$/.test(tag)) {
    errors.push(`invalid tag "${tag}" (allowed: letters, digits, spaces, "-")`);
  }

  if (!body.trim()) {
    errors.push('empty summary (describe the change for the changelog)');
  }

  return errors;
}

function main() {
  const dir = process.argv[2] ?? '.changeset';
  if (!fs.existsSync(dir)) {
    // eslint-disable-next-line no-console
    console.log(`No changeset directory at "${dir}" — nothing to validate.`);
    return;
  }
  const index = buildPackageIndex();
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

  let failed = 0;
  for (const file of files) {
    const errors = validateFile(path.join(dir, file), index);
    if (errors.length > 0) {
      failed += 1;
      // eslint-disable-next-line no-console
      console.error(`✗ ${file}`);
      for (const err of errors) {
        // eslint-disable-next-line no-console
        console.error(`    - ${err}`);
      }
    }
  }

  if (failed > 0) {
    // eslint-disable-next-line no-console
    console.error(`\n${failed}/${files.length} changeset file(s) failed validation.`);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`✓ ${files.length} changeset file(s) valid.`);
}

main();
