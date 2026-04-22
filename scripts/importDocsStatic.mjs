/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
import { persistentAuthStrategy } from '@mui/internal-code-infra/github';

const OWNER = 'mui';
const REPO = 'material-ui';
// Commit ref in mui/material-ui to import the static docs assets from.
// Override with IMPORT_DOCS_STATIC_REF env var when bumping.
const DEFAULT_REF = 'master';
const PATTERNS = [
  'docs/public/static/apple-touch-icon.png',
  'docs/public/static/favicon.ico',
  'docs/public/static/favicon.svg',
  'docs/public/static/icons/*',
  'docs/public/static/logo.png',
  'docs/public/static/logo.svg',
  'docs/public/static/manifest.json',
  'docs/public/static/styles',
];

const octokit = new Octokit({ authStrategy: persistentAuthStrategy });

async function getTree(ref) {
  const { data } = await octokit.rest.git.getTree({
    owner: OWNER,
    repo: REPO,
    tree_sha: ref,
    recursive: '1',
  });
  if (data.truncated) {
    throw new Error(`Tree for ${OWNER}/${REPO}@${ref} was truncated; cannot list all files.`);
  }
  return data.tree.filter((entry) => entry.type === 'blob');
}

function matchesPattern(filePath, pattern) {
  const dirPrefix = pattern.endsWith('/*') ? pattern.slice(0, -2) : pattern;
  return filePath === pattern || filePath.startsWith(`${dirPrefix}/`);
}

async function downloadFile(filePath, ref) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${ref}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  const ref = process.env.IMPORT_DOCS_STATIC_REF || DEFAULT_REF;
  console.log(`Importing static docs assets from ${OWNER}/${REPO}@${ref}`);

  const tree = await getTree(ref);
  const matched = tree.filter((entry) => PATTERNS.some((p) => matchesPattern(entry.path, p)));

  await Promise.all(
    matched.map(async (entry) => {
      const buf = await downloadFile(entry.path, ref);
      await fs.mkdir(path.dirname(entry.path), { recursive: true });
      await fs.writeFile(entry.path, buf);
      console.log(`fetched ${entry.path}`);
    }),
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
