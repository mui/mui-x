import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const asyncExec = util.promisify(exec);

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** Resolves local git remote URL the same order as get-project-id (upstream, then origin). */
async function tryGitRemoteUrl(command: string): Promise<string | null> {
  try {
    const response = await asyncExec(command, { timeout: 1000 });
    const url = String(response.stdout).trim();
    return url || null;
  } catch {
    return null;
  }
}

async function getExpectedGitRemoteUrl(): Promise<string | null> {
  return (
    (await tryGitRemoteUrl('git config --local --get remote.upstream.url')) ||
    (await tryGitRemoteUrl('git config --local --get remote.origin.url')) ||
    null
  );
}

describe('getAnonymousProjectId (integration)', () => {
  it('should prefer upstream remote over origin', async () => {
    const remoteUrl = await getExpectedGitRemoteUrl();

    const { default: getAnonymousProjectId } = await import('./get-project-id');
    const result = await getAnonymousProjectId();

    expect(result).toSatisfy((hash) =>
      remoteUrl !== null
        ? hash === sha256(remoteUrl)
        : /^[a-f0-9]{64}$/.test(hash),
    );
  });

  it('should not hash "[object Object]" (execCLI bug regression)', async () => {
    const { default: getAnonymousProjectId } = await import('./get-project-id');
    const result = await getAnonymousProjectId();

    // This was the old bug: String({stdout, stderr}) produced "[object Object]"
    expect(result).not.toBe(sha256('[object Object]'));
  });
});

describe('getPackageName (integration)', () => {
  it('should return a string or null', async () => {
    const { getPackageName } = await import('./get-project-id');
    const result = getPackageName();

    // In a monorepo, the root package.json may not have a name field,
    // so getPackageName() can return null — both outcomes are valid
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('should return the same name as the nearest package.json with a name field', async () => {
    const { getPackageName } = await import('./get-project-id');
    const result = getPackageName();

    // Walk up from cwd manually to verify
    let dir = process.cwd();
    let expectedName: string | null = null;
    const root = path.parse(dir).root;

    while (dir !== root) {
      const pkgPath = path.join(dir, 'package.json');
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name && typeof pkg.name === 'string') {
          expectedName = pkg.name;
          break;
        }
      } catch {
        // No package.json here
      }
      dir = path.dirname(dir);
    }

    expect(result).toBe(expectedName);
  });
});
