/** Adapter from codegen `onProgress` events to MCP `notifications/progress`. */
export const buildCodegenProgressForwarder = (
  extra: any,
  logger?: (message: string, error?: unknown) => void,
):
  | ((event: { kind: 'file' | 'done'; filename?: string; filesSeen: number }) => Promise<void>)
  | undefined => {
  // `_meta` is the MCP SDK's per-request metadata contract.
  // eslint-disable-next-line no-underscore-dangle
  const progressToken = extra?._meta?.progressToken;
  // `0` is a valid token per spec (TS SDK uses it first), so don't falsy-check.
  if (progressToken === undefined || progressToken === null) {
    return undefined;
  }
  // MCP requires `progress` to strictly increase; monotonic counter, decoupled from filesSeen.
  let progressTick = 0;
  return async (event) => {
    progressTick += 1;
    try {
      await extra.sendNotification({
        method: 'notifications/progress',
        params: {
          progressToken,
          progress: progressTick,
          message: event.kind === 'file' ? `Generated ${event.filename}` : 'Generation complete',
        },
      });
    } catch (err) {
      // UX-only: don't fail the run. Surface so users can diagnose silent UI freezes.
      logger?.('codegen: sendNotification (notifications/progress) failed', err);
    }
  };
};
