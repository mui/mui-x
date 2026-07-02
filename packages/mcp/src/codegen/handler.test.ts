import { describe, expect, it, vi } from 'vitest';
import { buildCodegenHandler } from './handler';

const sampleResult = {
  threadId: 'chat-1',
  files: [{ filename: 'App.tsx', contents: 'export default () => null;' }],
  explanation: "Here's a card.",
};

const buildDeps = (
  overrides: {
    execute?: ReturnType<typeof vi.fn>;
    formatText?: ReturnType<typeof vi.fn>;
    log?: ReturnType<typeof vi.fn>;
  } = {},
) => {
  const execute = overrides.execute ?? vi.fn().mockResolvedValue(sampleResult);
  const formatText = overrides.formatText ?? vi.fn().mockReturnValue('formatted text body');
  const log = overrides.log ?? vi.fn();
  const tool = { publicName: 'generateReactCode', execute };
  return {
    deps: { tool, formatText, log } as unknown as Parameters<typeof buildCodegenHandler>[0],
    execute,
    formatText,
    log,
    tool,
  };
};

describe('buildCodegenHandler', () => {
  it('returns MCP-shaped success: content (text) + structuredContent', async () => {
    const { deps, formatText } = buildDeps();
    const handler = buildCodegenHandler(deps);
    const result = await handler({ prompt: 'hi' }, {});

    expect(result).toEqual({
      content: [{ type: 'text', text: 'formatted text body' }],
      structuredContent: sampleResult,
    });
    expect(formatText).toHaveBeenCalledWith(sampleResult);
  });

  it('returns MCP-shaped error: content (message) + isError on tool failure', async () => {
    const execute = vi.fn().mockRejectedValue(new Error('upstream blew up'));
    const { deps } = buildDeps({ execute });
    const handler = buildCodegenHandler(deps);
    const result = await handler({ prompt: 'hi' }, {});

    expect(result).toEqual({
      content: [{ type: 'text', text: 'upstream blew up' }],
      isError: true,
    });
  });

  it('passes a request-bound progress forwarder to execute when a progressToken is present', async () => {
    const { deps, execute } = buildDeps();
    const handler = buildCodegenHandler(deps);
    await handler({ prompt: 'hi' }, { _meta: { progressToken: 'tok' }, sendNotification: vi.fn() });

    const [, ctx] = execute.mock.calls[0];
    expect(ctx.onProgress).toBeTypeOf('function');
  });

  it('passes no progress forwarder to execute when the request has no progressToken', async () => {
    const { deps, execute } = buildDeps();
    const handler = buildCodegenHandler(deps);
    await handler({ prompt: 'hi' }, {});

    const [, ctx] = execute.mock.calls[0];
    expect(ctx.onProgress).toBeUndefined();
  });

  it('forwards the request abort signal to execute', async () => {
    const { deps, execute } = buildDeps();
    const handler = buildCodegenHandler(deps);
    const { signal } = new AbortController();
    await handler({ prompt: 'hi' }, { signal });

    const [, ctx] = execute.mock.calls[0];
    expect(ctx.signal).toBe(signal);
  });

  it('logs success duration', async () => {
    const { deps, log } = buildDeps();
    const handler = buildCodegenHandler(deps);
    await handler({ prompt: 'hi' }, {});

    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/Executed generateReactCode in \d+ms/);
  });

  it('logs failure duration with the error message', async () => {
    const execute = vi.fn().mockRejectedValue(new Error('boom'));
    const { deps, log } = buildDeps({ execute });
    const handler = buildCodegenHandler(deps);
    await handler({ prompt: 'hi' }, {});

    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/generateReactCode failed in \d+ms: boom/);
  });
});
