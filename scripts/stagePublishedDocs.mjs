/* eslint-disable no-console */
// Stages the generated llms markdown docs of a product (see `pnpm docs:llms:build`) into the
// `published-docs/` folder of the package being built, so that they get shipped in its `docs/` folder.
// Usage (from a package's prebuild script): node ../../scripts/stagePublishedDocs.mjs <product>
import fs from 'node:fs/promises';
import path from 'node:path';

const product = process.argv[2];
if (!product) {
  throw new Error(
    'MUI X: Missing product argument for stagePublishedDocs.mjs.\n' +
      'The script cannot determine which docs to stage without it.\n' +
      'Pass the product name, for example: node ../../scripts/stagePublishedDocs.mjs charts',
  );
}

const PACKAGE_ROOT = process.cwd();
const DOCS_PUBLIC = path.resolve(import.meta.dirname, '../docs/public');
const STAGE_DIR = path.join(PACKAGE_ROOT, 'published-docs');

// Always clean up, so stale docs from a previous run never end up in a regular build.
await fs.rm(STAGE_DIR, { recursive: true, force: true });

if (!process.env.MUI_PUBLISH_DOCS) {
  console.log('[stage-docs] MUI_PUBLISH_DOCS not set, skipping docs staging.');
  process.exit(0);
}

const patterns = [
  `react-${product}/**/*.md`,
  `api/${product}/**/*.md`,
  `api/${product}.md`,
  `migration/migration-${product}-*.md`,
];

let count = 0;
for await (const entry of fs.glob(patterns, { cwd: path.join(DOCS_PUBLIC, 'x') })) {
  const src = path.join(DOCS_PUBLIC, 'x', entry);
  const dst = path.join(STAGE_DIR, entry);
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.copyFile(src, dst);
  count += 1;
}

if (count === 0) {
  throw new Error(
    `MUI X: No markdown files found for "${product}" in docs/public/x/.\n` +
      'The package would be published without its docs.\n' +
      'Run "pnpm docs:llms:build" first.',
  );
}

console.log(`[stage-docs] Staged ${count} markdown files into published-docs/.`);
