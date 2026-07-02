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

describe('registerDocsTools', () => {
  it('registers both docs tools when useMuiDocs is available', () => {
    const server = makeServer();

    registerDocsTools(
      server as unknown as Server,
      {
        fetchDocsTool: fakeTool('fetchDocs'),
        useMuiDocsTool: fakeTool('useMuiDocs'),
        logger: vi.fn(),
      } as unknown as Deps,
    );

    expect(server.registerTool).toHaveBeenCalledTimes(2);
    // fetchDocs first, then useMuiDocs.
    expect(server.registerTool.mock.calls.map((call) => call[0])).toEqual([
      'fetchDocs',
      'useMuiDocs',
    ]);
  });

  it('registers only fetchDocs and logs when the catalog was unreachable (useMuiDocs null)', () => {
    const server = makeServer();
    const logger = vi.fn();

    registerDocsTools(
      server as unknown as Server,
      {
        fetchDocsTool: fakeTool('fetchDocs'),
        useMuiDocsTool: null,
        logger,
      } as unknown as Deps,
    );

    expect(server.registerTool).toHaveBeenCalledTimes(1);
    expect(server.registerTool.mock.calls[0][0]).toBe('fetchDocs');
    expect(logger).toHaveBeenCalledWith(expect.stringContaining('useMuiDocs is unavailable'));
  });
});
