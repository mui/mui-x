import { describe, expect, it, vi } from 'vitest';
import { buildCodegenProgressForwarder } from './codegen-progress';

const buildExtra = () => {
  const sendNotification = vi.fn().mockResolvedValue(undefined);
  return {
    sendNotification,
    _meta: { progressToken: 'tok-1' },
  };
};

describe('buildCodegenProgressForwarder', () => {
  it('returns undefined when the request has no progressToken (no opt-in)', () => {
    const forwarder = buildCodegenProgressForwarder({ sendNotification: vi.fn() });
    expect(forwarder).toBeUndefined();
  });

  it('treats numeric `progressToken: 0` as a valid opt-in (MCP spec; TS SDK uses 0 first)', async () => {
    const sendNotification = vi.fn().mockResolvedValue(undefined);
    const extra = { sendNotification, _meta: { progressToken: 0 } };
    const forwarder = buildCodegenProgressForwarder(extra);

    expect(forwarder).toBeTypeOf('function');
    await forwarder!({ kind: 'file', filename: 'App.tsx', filesSeen: 1 });
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ progressToken: 0 }),
      }),
    );
  });

  it('emits strictly increasing `progress` values across file + done events (MCP spec)', async () => {
    const extra = buildExtra();
    const forwarder = buildCodegenProgressForwarder(extra)!;

    await forwarder({ kind: 'file', filename: 'App.tsx', filesSeen: 1 });
    await forwarder({ kind: 'file', filename: 'Quantity.tsx', filesSeen: 2 });
    await forwarder({ kind: 'done', filesSeen: 2 });

    const progressValues = extra.sendNotification.mock.calls.map(
      ([n]) => (n as any).params.progress,
    );
    expect(progressValues).toEqual([1, 2, 3]); // strictly increasing, decoupled from filesSeen
  });

  it('builds an MCP-shaped notification with the right method, token, and message', async () => {
    const extra = buildExtra();
    const forwarder = buildCodegenProgressForwarder(extra)!;
    await forwarder({ kind: 'file', filename: 'App.tsx', filesSeen: 1 });
    await forwarder({ kind: 'done', filesSeen: 1 });

    expect(extra.sendNotification).toHaveBeenNthCalledWith(1, {
      method: 'notifications/progress',
      params: { progressToken: 'tok-1', progress: 1, message: 'Generated App.tsx' },
    });
    expect(extra.sendNotification).toHaveBeenNthCalledWith(2, {
      method: 'notifications/progress',
      params: { progressToken: 'tok-1', progress: 2, message: 'Generation complete' },
    });
  });

  it('swallows a rejected sendNotification so progress is never load-bearing for the run', async () => {
    const extra = {
      sendNotification: vi.fn().mockRejectedValue(new Error('transport closed')),
      _meta: { progressToken: 'tok-1' },
    };
    const forwarder = buildCodegenProgressForwarder(extra)!;
    await expect(
      forwarder({ kind: 'file', filename: 'App.tsx', filesSeen: 1 }),
    ).resolves.toBeUndefined();
  });

  it('logs (via injected logger) when sendNotification rejects so silent UI freezes are diagnosable', async () => {
    const logger = vi.fn();
    const extra = {
      sendNotification: vi.fn().mockRejectedValue(new Error('transport closed')),
      _meta: { progressToken: 'tok-1' },
    };
    const forwarder = buildCodegenProgressForwarder(extra, logger)!;
    await forwarder({ kind: 'file', filename: 'App.tsx', filesSeen: 1 });

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger.mock.calls[0][0]).toMatch(/sendNotification.*failed/);
    expect(logger.mock.calls[0][1]).toBeInstanceOf(Error);
  });
});
