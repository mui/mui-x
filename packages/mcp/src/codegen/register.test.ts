import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { registerCodegenTool } from './register';

type Server = Parameters<typeof registerCodegenTool>[0];
type Deps = Parameters<typeof registerCodegenTool>[1];

const makeServer = () => ({ registerTool: vi.fn() });

const tool = {
  name: 'generateReactCode',
  description: 'generate code',
  inputSchema: z.object({ prompt: z.string() }),
  outputSchema: z.object({
    threadId: z.string(),
    files: z.array(z.string()),
    explanation: z.string(),
    muiPairing: z.object({ material: z.string(), muiX: z.string() }).optional(),
  }),
  execute: vi.fn(),
};

const makeDeps = () => ({
  tool,
  formatText: vi.fn(),
  logger: vi.fn(),
});

describe('registerCodegenTool', () => {
  it('registers generateReactCode with a handler', () => {
    const server = makeServer();

    registerCodegenTool(server as unknown as Server, makeDeps() as unknown as Deps);

    expect(server.registerTool).toHaveBeenCalledTimes(1);
    const [name, , handler] = server.registerTool.mock.calls[0];
    expect(name).toBe('generateReactCode');
    expect(typeof handler).toBe('function');
  });

  it('advertises both the input and output schemas so clients can discover structured results', () => {
    const server = makeServer();

    registerCodegenTool(server as unknown as Server, makeDeps() as unknown as Deps);

    const [, config] = server.registerTool.mock.calls[0];
    expect(Object.keys(config.inputSchema)).toContain('prompt');
    expect(Object.keys(config.outputSchema)).toEqual([
      'threadId',
      'files',
      'explanation',
      'muiPairing',
    ]);
  });
});
