/**
 * Run `fn`, retrying on rejection with the given backoff delays (one retry per entry). Rethrows the
 * last error once the delays are exhausted. `onRetry` observes each retry (e.g. for logging).
 * Recursive by design so it doesn't await inside a loop.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  delaysMs: readonly number[],
  onRetry?: (error: unknown, delayMs: number) => void,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (delaysMs.length === 0) {
      throw error;
    }
    const [delayMs, ...remaining] = delaysMs;
    onRetry?.(error, delayMs);
    await new Promise<void>((resolve) => {
      // `unref()` so a pending backoff can't keep the process alive after the transport closes.
      const timer = setTimeout(resolve, delayMs);
      timer.unref?.();
    });
    return withRetry(fn, remaining, onRetry);
  }
}
