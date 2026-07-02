import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { registerDocsTools } from './register';

type Server = Parameters<typeof registerDocsTools>[0];
type Deps = Parameters<typeof registerDocsTools>[1];

const fakeTool = (name: string) => ({
  name,
  description: `${name} description`,
  inputSchema: z.object({ q: z.string() }),
  outputSchema: z.string(),
  execute: vi.fn(async () => 'docs content'),
});

const makeServer = () => ({ registerTool: vi.fn() });

const makeDeps = (overrides: Partial<Record<keyof Deps, unknown>> = {}) => ({
  createUseMuiDocsTool: vi.fn(async () => fakeTool('useMuiDocs')),
  createFetchDocTool: vi.fn(async () => fakeTool('fetchDocs')),
  getPackagesList: vi.fn(async () => []),
  isUrlAllowed: () => true,
  logger: vi.fn(),
  concurrency: 10,
  fetchDocsDescription: 'fetch docs description',
  ...overrides,
});

describe('registerDocsTools', () => {
  it('registers both docs tools and returns true on success', async () => {
    const server = makeServer();
    const deps = makeDeps();

    const registered = await registerDocsTools(
      server as unknown as Server,
      deps as unknown as Deps,
    );

    expect(registered).toBe(true);
    expect(server.registerTool).toHaveBeenCalledTimes(2);
    // fetchDocs registers first (no catalog dependency), then useMuiDocs.
    expect(server.registerTool.mock.calls.map((call) => call[0])).toEqual([
      'fetchDocs',
      'useMuiDocs',
    ]);
  });

  it('passes the SSRF guard, cache, logger, and concurrency into both tool factories', async () => {
    const server = makeServer();
    const isUrlAllowed = () => true;
    const deps = makeDeps({ isUrlAllowed });

    await registerDocsTools(server as unknown as Server, deps as unknown as Deps);

    expect(deps.createUseMuiDocsTool).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: true,
        isUrlAllowed,
        logger: deps.logger,
        queue: { concurrency: 10 },
      }),
    );
    expect(deps.createFetchDocTool).toHaveBeenCalledWith(
      expect.objectContaining({
        cache: true,
        isUrlAllowed,
        logger: deps.logger,
        queue: { concurrency: 10 },
      }),
    );
  });

  it('still registers fetchDocs (and fails soft) when the catalog is unreachable', async () => {
    const server = makeServer();
    const deps = makeDeps({
      createUseMuiDocsTool: vi.fn(async () => {
        throw new Error('ECONNREFUSED');
      }),
    });

    const registered = await registerDocsTools(
      server as unknown as Server,
      deps as unknown as Deps,
    );

    // Fails soft: useMuiDocs is skipped, but fetchDocs (catalog-independent) still registers.
    expect(registered).toBe(false);
    expect(server.registerTool).toHaveBeenCalledTimes(1);
    expect(server.registerTool.mock.calls[0][0]).toBe('fetchDocs');
    expect(deps.logger).toHaveBeenCalledWith(
      expect.stringContaining('fetchDocs and generateReactCode are still available'),
      expect.any(Error),
    );
  });

  it('retries the catalog fetch before giving up (recovers from a cold start)', async () => {
    const server = makeServer();
    const getPackagesList = vi
      .fn()
      .mockRejectedValueOnce(new Error('cold start'))
      .mockResolvedValueOnce([{ name: '@mui/material' }]);
    const deps = makeDeps({
      getPackagesList,
      // Consume getPackagesList so the retry wrapper runs; no real delay between retries.
      createUseMuiDocsTool: vi.fn(async (opts: any) => {
        await opts.getPackagesList();
        return fakeTool('useMuiDocs');
      }),
      retryDelaysMs: [0],
    });

    const registered = await registerDocsTools(
      server as unknown as Server,
      deps as unknown as Deps,
    );

    expect(registered).toBe(true);
    expect(getPackagesList).toHaveBeenCalledTimes(2); // failed once, retried once
  });

  it('fails soft after exhausting catalog retries', async () => {
    const server = makeServer();
    const getPackagesList = vi.fn().mockRejectedValue(new Error('down'));
    const deps = makeDeps({
      getPackagesList,
      createUseMuiDocsTool: vi.fn(async (opts: any) => {
        await opts.getPackagesList();
        return fakeTool('useMuiDocs');
      }),
      retryDelaysMs: [0, 0],
    });

    const registered = await registerDocsTools(
      server as unknown as Server,
      deps as unknown as Deps,
    );

    expect(registered).toBe(false);
    expect(getPackagesList).toHaveBeenCalledTimes(3); // initial + 2 retries
  });
});
