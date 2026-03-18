import { describe, it, expect, vi } from 'vitest';
import { createHash } from 'crypto';
import { isJSDOM } from '@mui/x-internals/platform';

function nodeHash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

describe.runIf(isJSDOM)('hashString', () => {
  it('should produce the same output as Node crypto.createHash', async () => {
    const input = 'consistency-test';

    const { hashString } = await import('./utils');
    const runtimeResult = await hashString(input);

    expect(runtimeResult).toBe(nodeHash(input));
  });

  it('should produce the same projectId from postinstall and runtime for the same package name', async () => {
    const packageName = 'my-app';

    // Simulate what postinstall does: getPackageName() returns "my-app",
    // then getAnonymousProjectId() hashes it with crypto.createHash('sha256')
    const postinstallResult = nodeHash(packageName);

    // Simulate what runtime does: npm_package_name = "my-app",
    // then getRuntimeProjectId() hashes it with crypto.subtle.digest('SHA-256')
    vi.stubEnv('npm_package_name', packageName);
    const { getRuntimeProjectId } = await import('./get-context');
    const runtimeResult = await getRuntimeProjectId();
    vi.unstubAllEnvs();

    expect(runtimeResult).toBe(postinstallResult);
  });
});
