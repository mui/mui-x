import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { sha256 } from './hash';

const asyncExec = util.promisify(exec);

async function execCLI(command: string): Promise<string | null> {
  try {
    const response = await asyncExec(command, {
      timeout: 1000,
      windowsHide: true,
    });

    return String(response.stdout).trim();
  } catch (_) {
    return null;
  }
}

export function getPackageName(): string | null {
  const cwd = process.cwd();
  const segments = cwd.split(path.sep);

  for (let i = segments.length; i > 0; i -= 1) {
    const dir = segments.slice(0, i).join(path.sep) || path.sep;
    try {
      const content = fs.readFileSync(path.join(dir, 'package.json'), 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.name && typeof pkg.name === 'string') {
        return pkg.name;
      }
    } catch (_) {
      // No package.json at this level, continue walking up
    }
  }

  return null;
}

// Q: Why does MUI send multiple project identifiers?
// A:
// MUI's telemetry always anonymizes these values. We send three separate
// signals (repoId, packageName, rootPathId) plus a computed projectId
// so we can handle monorepos (same repo, different apps) and micro-frontends
// (different repos, same app) correctly on the backend.

// repoId: identifies the repository (git remote URL)
async function getRawRepoId(): Promise<string | null> {
  return (
    (await execCLI(`git config --local --get remote.upstream.url`)) ||
    (await execCLI(`git config --local --get remote.origin.url`)) ||
    process.env.REPOSITORY_URL ||
    null
  );
}

// packageName: identifies the application (nearest package.json name)
function getRawPackageName(): string | null {
  return getPackageName();
}

// rootPathId: last-resort identifier (git root or cwd, unique per developer)
async function getRawRootPathId(): Promise<string> {
  return (await execCLI(`git rev-parse --show-toplevel`)) || process.cwd();
}

export async function getAnonymousRepoId(): Promise<string | null> {
  const raw = await getRawRepoId();
  return raw ? sha256(raw) : null;
}

export async function getAnonymousPackageName(): Promise<string | null> {
  const raw = getRawPackageName();
  return raw ? sha256(raw) : null;
}

export async function getAnonymousRootPathId(): Promise<string> {
  const raw = await getRawRootPathId();
  return sha256(raw);
}

// projectId: best available identifier, picks the strongest signal
export default async function getAnonymousProjectId(): Promise<string> {
  return (
    (await getAnonymousRepoId()) ||
    (await getAnonymousPackageName()) ||
    (await getAnonymousRootPathId())
  );
}
