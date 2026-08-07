import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { registerFetchDocsTool, registerUseMuiDocsTool } from './register';

type Server = Parameters<typeof registerFetchDocsTool>[0];
type FetchTool = Parameters<typeof registerFetchDocsTool>[1];
type UseTool = NonNullable<Parameters<typeof registerUseMuiDocsTool>[1]>;

const fakeTool = (name: string) => ({
  name,
  description: `${name} description`,
  inputSchema: z.object({ q: z.string() }),
  outputSchema: z.string(),
  execute: vi.fn(async () => 'docs content'),
});

const makeServer = () => ({ registerTool: vi.fn() });

describe('registerFetchDocsTool', () => {
  it('registers fetchDocs', () => {
    const server = makeServer();

    registerFetchDocsTool(
      server as unknown as Server,
      fakeTool('fetchDocs') as unknown as FetchTool,
      vi.fn(),
    );

    expect(server.registerTool).toHaveBeenCalledTimes(1);
    expect(server.registerTool.mock.calls[0][0]).toBe('fetchDocs');
  });
});

describe('registerUseMuiDocsTool', () => {
  it('registers useMuiDocs when the catalog was reachable', () => {
    const server = makeServer();

    registerUseMuiDocsTool(
      server as unknown as Server,
      fakeTool('useMuiDocs') as unknown as UseTool,
      vi.fn(),
    );

    expect(server.registerTool).toHaveBeenCalledTimes(1);
    expect(server.registerTool.mock.calls[0][0]).toBe('useMuiDocs');
  });

  it('registers nothing and logs when useMuiDocs is null (catalog unreachable)', () => {
    const server = makeServer();
    const logger = vi.fn();

    registerUseMuiDocsTool(server as unknown as Server, null, logger);

    expect(server.registerTool).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledWith(expect.stringContaining('useMuiDocs is unavailable'));
  });
});
