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
  'docs/public/static/favicon.ico',
  'docs/public/static/icons/*',
  'docs/public/static/logo.png',
  'docs/public/static/logo.svg',
  'docs/public/static/manifest.json',
  'docs/public/static/styles',
];

const octokit = new Octokit({ authStrategy: persistentAuthStrategy });

async function getContent(repoPath, ref) {
  const { data } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: repoPath,
    ref,
  });
  return data;
}

async function listDir(repoPath, ref) {
  const entries = await getContent(repoPath, ref);
  const out = [];
  for (const entry of entries) {
    if (entry.type === 'file') {
      out.push(entry);
    } else if (entry.type === 'dir') {
      // eslint-disable-next-line no-await-in-loop
      out.push(...(await listDir(entry.path, ref)));
    }
  }
  return out;
}

async function resolvePattern(pattern, ref) {
  const repoPath = pattern.endsWith('/*') ? pattern.slice(0, -2) : pattern;
  const info = await getContent(repoPath, ref);
  if (Array.isArray(info)) {
    const files = [];
    for (const entry of info) {
      if (entry.type === 'file') {
        files.push(entry);
      } else if (entry.type === 'dir') {
        // eslint-disable-next-line no-await-in-loop
        files.push(...(await listDir(entry.path, ref)));
      }
    }
    return files;
  }
  return [info];
}

async function downloadFile(entry) {
  const res = await fetch(entry.download_url);
  if (!res.ok) {
    throw new Error(`GET ${entry.download_url} -> ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  const ref = process.env.IMPORT_DOCS_STATIC_REF || DEFAULT_REF;
  console.log(`Importing static docs assets from ${OWNER}/${REPO}@${ref}`);

  const entries = [];
  for (const pattern of PATTERNS) {
    // eslint-disable-next-line no-await-in-loop
    entries.push(...(await resolvePattern(pattern, ref)));
  }

  await Promise.all(
    entries.map(async (entry) => {
      const buf = await downloadFile(entry);
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
