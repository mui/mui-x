import { describe, expect, it, vi } from 'vitest';
import { buildDocsHandler } from './handler';

describe('buildDocsHandler', () => {
  it('wraps the tool result in MCP `content` shape (single text block)', async () => {
    const execute = vi.fn().mockResolvedValue('the docs content');
    const tool = { publicName: 'useMuiDocs', execute };
    const handler = buildDocsHandler(tool, vi.fn());

    const result = await handler({ sources: ['x'] });

    expect(result).toEqual({ content: [{ type: 'text', text: 'the docs content' }] });
    expect(execute).toHaveBeenCalledWith({ sources: ['x'] }, { signal: undefined });
  });

  it('logs success duration with the tool publicName', async () => {
    const log = vi.fn();
    const handler = buildDocsHandler(
      { publicName: 'fetchDocs', execute: vi.fn().mockResolvedValue('ok') },
      log,
    );
    await handler({ urls: ['x'] });

    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/Executed fetchDocs in \d+ms/);
  });

  it('propagates tool errors (no swallowing - callers expect them surfaced to the agent)', async () => {
    const handler = buildDocsHandler(
      { publicName: 'fetchDocs', execute: vi.fn().mockRejectedValue(new Error('fetch failed')) },
      vi.fn(),
    );
    await expect(handler({ urls: ['x'] })).rejects.toThrow(/fetch failed/);
  });
});
