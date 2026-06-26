import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { registerDocsTools } from './register';

type Server = Parameters<typeof registerDocsTools>[0];
type Deps = Parameters<typeof registerDocsTools>[1];

const fakeTool = (publicName: string) => ({
  publicName,
  description: `${publicName} description`,
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
    expect(server.registerTool.mock.calls.map((call) => call[0])).toEqual([
      'useMuiDocs',
      'fetchDocs',
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

  it('does not throw and registers nothing when the catalog is unreachable', async () => {
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

    // Fails soft: codegen registration downstream still runs.
    expect(registered).toBe(false);
    expect(server.registerTool).not.toHaveBeenCalled();
    expect(deps.logger).toHaveBeenCalledWith(
      expect.stringContaining('generateReactCode is still available'),
      expect.any(Error),
    );
  });
});
