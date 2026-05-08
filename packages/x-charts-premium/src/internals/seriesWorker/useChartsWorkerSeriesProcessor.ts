'use client';
import * as React from 'react';
import type { ChartSeriesProcessor } from '@mui/x-charts/internals';
import type { SeriesProcessorRequest, SeriesProcessorResponse } from './protocol';

let nextRequestId = 0;

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
  const workerRef = React.useRef<Worker | null>(null);
  const pendingRef = React.useRef<
    Map<number, { resolve: (data: SeriesProcessorResponse) => void }>
  >(new Map());

  const supported = typeof window !== 'undefined' && typeof Worker !== 'undefined';

  React.useEffect(() => {
    if (!supported) {
      return undefined;
    }
    const worker = new Worker(new URL('./seriesProcessor.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;
    // Capture the map ref locally so cleanup uses the same instance even if
    // `pendingRef.current` is later swapped (it isn't, but lint requires
    // proof via a local).
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
      workerRef.current = null;
      pending.clear();
    };
  }, [supported]);

  return React.useMemo<ChartSeriesProcessor | undefined>(() => {
    if (!supported) {
      return undefined;
    }
    return (input) =>
      new Promise((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          // Worker not yet mounted (first render before effect fires) — reject
          // so the plugin surfaces an error and the consumer can retry.
          reject(new Error('MUI X Charts: series-processing worker is not ready yet.'));
          return;
        }
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
  }, [supported]);
}
