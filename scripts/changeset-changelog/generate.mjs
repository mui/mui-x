#!/usr/bin/env node
/**
 * PROTOTYPE — changeset-sourced changelog generator for MUI X.
 *
 * Reads `.changeset/*.md` files and renders the product sections of the
 * changelog in the existing MUI X format (per product, per tier, with the
 * "Same changes as <previous tier>, plus:" inheritance), preserving the
 * original `[tag]`-prefixed bullets and within-section ordering.
 *
 * Out of scope for the prototype (kept by the real release script):
 * - Docs / Core / Miscellaneous sections (commit-scraped — hybrid model).
 * - Contributors thank-you + highlights (GitHub API).
 * - Version computation (`changeset version`).
 *
 * Attribution source order:
 * 1. `pr` / `author` frontmatter fields (if present).
 * 2. git-blame of the changeset file → its introducing PR squash-merge commit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { PRODUCTS, TIER_META, TIER_RANK, DEFAULT_TAG, buildPackageIndex } from './config.mjs';

/** Minimal frontmatter parser for a changeset file. */
function parseChangeset(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return null;
  }
  const [, frontmatter, body] = match;

  const packages = {};
  let pr;
  let author;
  let tag;
  for (const line of frontmatter.split('\n')) {
    const pkgMatch = line.match(/^["'](@mui\/[^"']+)["']:\s*(major|minor|patch)\s*$/);
    if (pkgMatch) {
      packages[pkgMatch[1]] = pkgMatch[2];
      continue;
    }
    const prMatch = line.match(/^pr:\s*#?(\d+)\s*$/);
    if (prMatch) {
      pr = prMatch[1];
      continue;
    }
    const authorMatch = line.match(/^author:\s*@?(.+?)\s*$/);
    if (authorMatch) {
      author = authorMatch[1];
      continue;
    }
    const tagMatch = line.match(/^tag:\s*\[?([\w- ]+?)\]?\s*$/);
    if (tagMatch) {
      tag = tagMatch[1];
    }
  }

  return {
    id: path.basename(filePath, '.md'),
    filePath,
    packages,
    summary: body.trim(),
    pr,
    author,
    tag,
  };
}

/** Lowest-tier product hit for a changeset (drives section + default tag). */
function resolveTarget(changeset, index) {
  let target = null;
  for (const pkg of Object.keys(changeset.packages)) {
    const hit = index.get(pkg);
    if (hit && (!target || TIER_RANK[hit.tier] < TIER_RANK[target.tier])) {
      target = hit;
    }
  }
  return target;
}

/** Resolve `(#PR) @author` for a changeset, falling back to git-blame. */
function resolveAttribution(changeset) {
  let { pr, author } = changeset;
  if (!pr || !author) {
    try {
      // The commit that ADDED this changeset file is its PR squash-merge.
      const sha = execSync(
        `git log --diff-filter=A --follow --format=%H -1 -- "${changeset.filePath}"`,
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      if (sha) {
        const subject = execSync(`git log -1 --format=%s ${sha}`, { encoding: 'utf8' }).trim();
        pr = pr ?? subject.match(/\(#(\d+)\)/)?.[1];
        // commit author login isn't in git metadata; real script resolves via GitHub API.
        author = author ?? execSync(`git log -1 --format=%an ${sha}`, { encoding: 'utf8' }).trim();
      }
    } catch {
      /* not committed yet (e.g. local prototype run) */
    }
  }
  const suffix = [pr && `(#${pr})`, author && `@${author}`].filter(Boolean).join(' ');
  return suffix ? ` ${suffix}` : '';
}

/** Render one changeset as a `[tag]`-prefixed bullet + indented continuation. */
function renderEntry(entry) {
  const attribution = resolveAttribution(entry.changeset);
  const [first, ...rest] = entry.changeset.summary.split('\n');
  const lines = [`- [${entry.tag}] ${first}${attribution}`];
  for (const line of rest) {
    lines.push(`  ${line}`.trimEnd());
  }
  return lines.join('\n');
}

/** Original within-section order: by tag, then by first summary line. */
function sortEntries(entries) {
  return entries.sort((a, b) => {
    if (a.tag === b.tag) {
      return a.changeset.summary < b.changeset.summary ? -1 : 1;
    }
    return a.tag.localeCompare(b.tag);
  });
}

function getPackageVersion(pkg) {
  const p = path.join(process.cwd(), 'packages', pkg, 'package.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')).version ?? '__VERSION__';
  } catch {
    return '__VERSION__';
  }
}

function main() {
  const changesetDir = process.argv[2] ?? path.join(process.cwd(), '.changeset');
  if (!fs.existsSync(changesetDir)) {
    // eslint-disable-next-line no-console
    console.error(`No changeset directory at "${changesetDir}".`);
    process.exit(1);
  }
  const index = buildPackageIndex();

  const changesets = fs
    .readdirSync(changesetDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => parseChangeset(path.join(changesetDir, f)))
    .filter(Boolean);

  // Bucket: product.name → tier → entries[] (lowest listed tier wins).
  const buckets = new Map();
  for (const changeset of changesets) {
    const target = resolveTarget(changeset, index);
    if (!target) {
      continue; // non-product package (e.g. x-internals) — handled elsewhere
    }
    if (!buckets.has(target.product.name)) {
      buckets.set(target.product.name, { base: [], pro: [], premium: [] });
    }
    const tag = changeset.tag ?? DEFAULT_TAG[target.pkg] ?? target.pkg;
    buckets.get(target.product.name)[target.tier].push({ changeset, tag });
  }

  const out = [];
  for (const product of PRODUCTS) {
    const bucket = buckets.get(product.name);
    if (!bucket) {
      continue;
    }
    const { tiers } = product;
    out.push(`### ${product.name}`);

    out.push(`#### \`@mui/${tiers.base}@${getPackageVersion(tiers.base)}\``);
    out.push(sortEntries(bucket.base).map(renderEntry).join('\n') || 'Internal changes.');

    let prevTier = `@mui/${tiers.base}`;
    for (const tier of ['pro', 'premium']) {
      if (!tiers[tier]) {
        continue;
      }
      const version = getPackageVersion(tiers[tier]);
      out.push(`#### \`@mui/${tiers[tier]}@${version}\` ${TIER_META[tier]}`);
      if (bucket[tier].length > 0) {
        out.push(`Same changes as in \`${prevTier}@${version}\`, plus:`);
        out.push(sortEntries(bucket[tier]).map(renderEntry).join('\n'));
      } else {
        out.push(`Same changes as in \`${prevTier}@${version}\`.`);
      }
      prevTier = `@mui/${tiers[tier]}`;
    }
  }

  // eslint-disable-next-line no-console -- prototype output
  console.log(out.join('\n\n'));
}

main();
