/**
 * Run `fn`, retrying on rejection with the given backoff delays (one retry per entry). Rethrows the
 * last error once the delays are exhausted, or the abort reason if `signal` fires mid-backoff.
 * `onRetry` observes each retry (e.g. for logging). Recursive by design so it doesn't await in a loop.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  delaysMs: readonly number[],
  onRetry?: (error: unknown, delayMs: number) => void,
  signal?: AbortSignal,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (delaysMs.length === 0 || signal?.aborted) {
      throw error;
    }
    const [delayMs, ...remaining] = delaysMs;
    onRetry?.(error, delayMs);
    await sleep(delayMs, signal);
    return withRetry(fn, remaining, onRetry, signal);
  }
}

// Resolve after `delayMs`, or reject with the abort reason if `signal` fires first. The timer is
// ref'd (kept alive) so an awaited retry always settles; pass `signal` to cancel a pending wait.
function sleep(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal!.reason);
    };
    timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
