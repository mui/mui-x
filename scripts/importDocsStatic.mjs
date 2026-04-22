/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
// picomatch is the matcher engine globby uses internally (already a transitive dep via globby → fast-glob → micromatch).
// globby itself is not used to avoid the overhead of scanning the local filesystem for matching files, since we already have a complete listing of the remote files from the GitHub API.
import picomatch from 'picomatch';
import { persistentAuthStrategy } from '@mui/internal-code-infra/github';

const OWNER = 'mui';
const REPO = 'material-ui';
// Commit ref in mui/material-ui to import the static docs assets from.
// Override with IMPORT_DOCS_STATIC_REF env var when needed.
const DEFAULT_REF = 'master';
const BASE_DIR = 'docs/public/static';
// Globby/picomatch patterns relative to BASE_DIR. `*` matches one segment, `**` matches any depth.
const PATTERNS = [
  'apple-touch-icon.png',
  'favicon.ico',
  'favicon.svg',
  'icons/*',
  'logo.png',
  'logo.svg',
  'manifest.json',
  'styles/**',
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

const isMatch = picomatch(PATTERNS);

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
    .filter((entry) => isMatch(entry.path));

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
