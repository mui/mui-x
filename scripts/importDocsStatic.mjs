/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
import { persistentAuthStrategy } from '@mui/internal-code-infra/github';

const OWNER = 'mui';
const REPO = 'material-ui';
// Pinned commit ref in mui/material-ui to import the static docs assets from.
// Override with IMPORT_DOCS_STATIC_REF env var only when intentionally bumping.
const DEFAULT_REF = '2dc145f2d2bece8f30293137e276bdbdb4cda294';
const BASE_DIR = 'docs/public/static';
// Patterns are relative to BASE_DIR. Trailing `/*` or a bare dir means "all files under".
const PATTERNS = [
  'apple-touch-icon.png',
  'favicon.ico',
  'favicon.svg',
  'icons/*',
  'logo.png',
  'logo.svg',
  'manifest.json',
  'styles',
];

const octokit = new Octokit({ authStrategy: persistentAuthStrategy });

async function getTree(treeSha, { recursive = false } = {}) {
  const { data } = await octokit.rest.git.getTree({
    owner: OWNER,
    repo: REPO,
    tree_sha: treeSha,
    ...(recursive ? { recursive: '1' } : {}),
  });
  if (data.truncated) {
    throw new Error(`Tree ${treeSha} was truncated; cannot list all files.`);
  }
  return data.tree;
}

async function resolveTreeSha(ref, dirPath) {
  let sha = ref;
  for (const part of dirPath.split('/')) {
    // eslint-disable-next-line no-await-in-loop
    const entries = await getTree(sha);
    const match = entries.find((entry) => entry.path === part && entry.type === 'tree');
    if (!match) {
      throw new Error(
        `Directory ${dirPath} not found at segment '${part}' in ${OWNER}/${REPO}@${ref}`,
      );
    }
    sha = match.sha;
  }
  return sha;
}

function matchesPattern(relPath, pattern) {
  const dirPrefix = pattern.endsWith('/*') ? pattern.slice(0, -2) : pattern;
  return relPath === pattern || relPath.startsWith(`${dirPrefix}/`);
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

  const baseSha = await resolveTreeSha(ref, BASE_DIR);
  const subtree = await getTree(baseSha, { recursive: true });
  const matched = subtree
    .filter((entry) => entry.type === 'blob')
    .filter((entry) => PATTERNS.some((p) => matchesPattern(entry.path, p)));

  await Promise.all(
    matched.map(async (entry) => {
      const filePath = `${BASE_DIR}/${entry.path}`;
      const buf = await downloadFile(filePath, ref);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buf);
      console.log(`fetched ${filePath}`);
    }),
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
