'use client';
import * as React from 'react';
import type { ChartSeriesProcessor } from '@mui/x-charts/internals';
import type { SeriesProcessorRequest, SeriesProcessorResponse } from './protocol';

let nextRequestId = 0;

function isWorkerSupported(): boolean {
  return typeof window !== 'undefined' && typeof Worker !== 'undefined';
}

/**
 * Returns a `ChartSeriesProcessor` that runs the series defaultize step on a
 * dedicated Web Worker, off the main thread.
 *
 * Pass the returned function as `seriesProcessor` on a chart's
 * `ChartsContainerPremium` (or directly via the `ChartsDataProvider`-level
 * `pluginParams`). When the chart's `series` prop changes, the work is
 * shipped to the worker and the result is committed via the existing async
 * pipeline (`pending → success`/`error`).
 *
 * Returns `undefined` in environments without `Worker` support (SSR, older
 * browsers) so callers can fall back to the default in-process pipeline.
 * @returns {ChartSeriesProcessor | undefined} The worker-backed processor, or `undefined` when unsupported.
 */
export function useChartsWorkerSeriesProcessor(): ChartSeriesProcessor | undefined {
  // Lazy-init via `useState` so the worker exists synchronously on the very
  // first render — using `useEffect` would mean the first call to the
  // processor races the effect (and used to throw "worker is not ready
  // yet"). React calls the initializer once per mount.
  const [worker] = React.useState<Worker | null>(() => {
    if (!isWorkerSupported()) {
      return null;
    }
    return new Worker(new URL('./seriesProcessor.worker.ts', import.meta.url), {
      type: 'module',
    });
  });

  const pendingRef = React.useRef<
    Map<number, { resolve: (response: SeriesProcessorResponse) => void }>
  >(new Map());

  React.useEffect(() => {
    if (!worker) {
      return undefined;
    }
    const pending = pendingRef.current;
    const onMessage = (event: MessageEvent<SeriesProcessorResponse>) => {
      const message = event.data;
      const entry = pending.get(message.id);
      if (!entry) {
        return;
      }
      pending.delete(message.id);
      entry.resolve(message);
    };
    worker.addEventListener('message', onMessage);

    return () => {
      worker.removeEventListener('message', onMessage);
      worker.terminate();
      pending.clear();
    };
  }, [worker]);

  return React.useMemo<ChartSeriesProcessor | undefined>(() => {
    if (!worker) {
      return undefined;
    }
    return (input) =>
      new Promise((resolve, reject) => {
        const id = nextRequestId;
        nextRequestId += 1;
        pendingRef.current.set(id, {
          resolve: (response) => {
            if (response.type === 'success') {
              resolve(response.data);
            } else {
              reject(new Error(response.message));
            }
          },
        });
        const request: SeriesProcessorRequest = { type: 'process', id, payload: input };
        worker.postMessage(request);
      });
  }, [worker]);
}
