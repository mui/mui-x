import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { wrapTool } from './wrap-tool';

const makeTool = (execute = vi.fn(async () => 'ok')) =>
  wrapTool({
    name: 't',
    description: 'd',
    inputSchema: z.object({ q: z.string().min(1) }),
    outputSchema: z.string(),
    execute,
  });

describe('wrapTool', () => {
  it('validates input against inputSchema before calling execute', async () => {
    const execute = vi.fn(async () => 'ok');
    const tool = makeTool(execute);

    await expect(tool.execute({ q: '' } as never)).rejects.toThrow();
    expect(execute).not.toHaveBeenCalled();
  });

  it('passes the parsed input (unknown keys stripped) plus context to execute', async () => {
    const execute = vi.fn(async () => 'ok');
    const tool = makeTool(execute);
    const context = { signal: new AbortController().signal };

    await tool.execute({ q: 'hi', extra: 'nope' } as never, context);

    expect(execute).toHaveBeenCalledWith({ q: 'hi' }, context);
  });
});
