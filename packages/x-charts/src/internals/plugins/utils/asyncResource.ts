// Lifecycle status of the internal async processing pipelines used by
// `useChartSeries` and `useChartCartesianAxis`.
//
// The plugins always receive sync arrays from props; the pipeline is async
// only in how it commits the *processing* result to the store (microtask),
// so consumers see a useQuery-shaped status alongside the data.
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncPipelineResult<R> {
  status: AsyncStatus;
  data?: R;
  error?: Error;
}

/**
 * Runs `process` asynchronously and reports the outcome to `onSettled`.
 *
 * The first thing `onSettled` receives is `{status: 'pending'}`; on the next
 * macrotask `process` runs and either `{status: 'success', data}` or
 * `{status: 'error', error}` is reported.
 *
 * `setTimeout(_, 0)` is used (rather than `Promise.resolve().then`) so the
 * browser can paint the pending state between the two settlements. Stale runs
 * are dropped via the `requestId` mechanism — the caller increments
 * `requestIdRef.current` and passes the new value as `requestId`; any later
 * resolve whose stored id no longer matches `requestIdRef.current` is
 * ignored.
 * @param {() => R} process Sync transform that performs the heavy work.
 * @param {(result: AsyncPipelineResult<R>) => void} onSettled Receives the pipeline outcome.
 * @param {{ current: number }} requestIdRef Mutable ref tracking the latest request id.
 * @param {number} requestId The id of this invocation; compared against `requestIdRef`.
 */
export function runAsyncPipeline<R>(
  process: () => R,
  onSettled: (result: AsyncPipelineResult<R>) => void,
  requestIdRef: { current: number },
  requestId: number,
): void {
  onSettled({ status: 'pending' });
  setTimeout(() => {
    if (requestId !== requestIdRef.current) {
      return;
    }
    try {
      const data = process();
      onSettled({ status: 'success', data });
    } catch (err) {
      onSettled({ status: 'error', error: err as Error });
    }
  }, 0);
}
