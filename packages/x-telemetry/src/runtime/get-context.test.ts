import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHash } from 'crypto';
import { isJSDOM } from '@mui/x-internals/platform';
import telemetryContext from '../context';

vi.mock('../context', () => ({
  default: {
    config: { isInitialized: true, runtimePackageNameHashResolved: false },
    traits: {
      machineId: 'test-machine-id',
      projectId: null,
      sessionId: 'test-session-id',
      anonymousId: 'test-anonymous-id',
      isCI: false,
      isDocker: false,
    },
  },
}));

function nodeHash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

describe.runIf(isJSDOM)('getRuntimePackageHash', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('should return hashed npm_package_name when set', async () => {
    vi.stubEnv('npm_package_name', 'test-app');

    const { getRuntimePackageHash } = await import('./get-context');
    const result = await getRuntimePackageHash();

    expect(result).toBe(nodeHash('test-app'));
  });

  it('should fall back to fetch /package.json when npm_package_name is not set', async () => {
    vi.stubEnv('npm_package_name', '');

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ name: 'fetched-app' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { getRuntimePackageHash } = await import('./get-context');
    const result = await getRuntimePackageHash();

    expect(result).toBe(nodeHash('fetched-app'));
    expect(fetchSpy).toHaveBeenCalledWith('/package.json');
  });

  it('should return null when fetch fails', async () => {
    vi.stubEnv('npm_package_name', '');

    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const { getRuntimePackageHash } = await import('./get-context');
    const result = await getRuntimePackageHash();

    expect(result).toBeNull();
  });

  it('should return null when fetch returns 404', async () => {
    vi.stubEnv('npm_package_name', '');

    fetchSpy.mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

    const { getRuntimePackageHash } = await import('./get-context');
    const result = await getRuntimePackageHash();

    expect(result).toBeNull();
  });

  it('should return null when fetched package.json has no name', async () => {
    vi.stubEnv('npm_package_name', '');

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ version: '1.0.0' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { getRuntimePackageHash } = await import('./get-context');
    const result = await getRuntimePackageHash();

    expect(result).toBeNull();
  });
});

describe.runIf(isJSDOM)('getTelemetryContext runtimePackageNameHash', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    telemetryContext.traits.projectId = null;
    telemetryContext.traits.repoHash = null;
    telemetryContext.traits.runtimePackageNameHash = null;
    telemetryContext.traits.postinstallPackageNameHash = null;
    telemetryContext.traits.rootPathHash = null;
    telemetryContext.config.runtimePackageNameHashResolved = false;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('should not repeatedly call getRuntimePackageHash when it returns null', async () => {
    vi.stubEnv('npm_package_name', '');
    fetchSpy.mockResolvedValue(new Response('Not Found', { status: 404 }));

    const { default: getTelemetryContext } = await import('./get-context');

    const ctx1 = await getTelemetryContext();
    expect(ctx1.traits.runtimePackageNameHash).toBeNull();

    const ctx2 = await getTelemetryContext();
    expect(ctx2.traits.runtimePackageNameHash).toBeNull();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should always resolve runtimePackageNameHash even when projectId is set', async () => {
    telemetryContext.traits.projectId = 'existing-hash';
    telemetryContext.traits.repoHash = 'existing-hash';
    vi.stubEnv('npm_package_name', 'my-app');

    const { default: getTelemetryContext } = await import('./get-context');
    const ctx = await getTelemetryContext();

    expect(ctx.traits.runtimePackageNameHash).toBe(nodeHash('my-app'));
    // projectId stays as repoHash since it takes priority
    expect(ctx.traits.projectId).toBe('existing-hash');
  });

  it('should set projectId from runtimePackageNameHash when no repoHash', async () => {
    vi.stubEnv('npm_package_name', 'fallback-app');

    const { default: getTelemetryContext } = await import('./get-context');
    const ctx = await getTelemetryContext();

    expect(ctx.traits.runtimePackageNameHash).toBe(nodeHash('fallback-app'));
    expect(ctx.traits.projectId).toBe(nodeHash('fallback-app'));
  });

  it('should prefer repoHash over runtimePackageNameHash for projectId', async () => {
    telemetryContext.traits.repoHash = 'repo-hash-value';
    vi.stubEnv('npm_package_name', 'my-app');

    const { default: getTelemetryContext } = await import('./get-context');
    const ctx = await getTelemetryContext();

    expect(ctx.traits.runtimePackageNameHash).toBe(nodeHash('my-app'));
    expect(ctx.traits.projectId).toBe('repo-hash-value');
  });
});
