// Web Worker that runs the series defaultize step off the main thread.
//
// Bundlers (webpack 5, Vite, esbuild) detect the
// `new Worker(new URL('...', import.meta.url), { type: 'module' })`
// pattern in `useChartsWorkerSeriesProcessor.ts` and emit this file as a
// separate chunk. The worker is plain ESM and bundles everything it needs.
//
// The seriesConfig is hardcoded inside the worker because it contains
// non-serializable functions (e.g. `getSeriesWithDefaultValues`) that can't
// cross the worker boundary as part of the message payload. The worker
// currently bundles configs for the four core series types (bar / line /
// pie / scatter); pro/premium series types can be added by augmenting this
// file when the use-case arises.

import {
  defaultizeSeries,
  barSeriesConfig,
  lineSeriesConfig,
  pieSeriesConfig,
  scatterSeriesConfig,
} from '@mui/x-charts/internals';
import type { SeriesProcessorRequest, SeriesProcessorResponse } from './protocol';

const seriesConfig = {
  bar: barSeriesConfig,
  line: lineSeriesConfig,
  pie: pieSeriesConfig,
  scatter: scatterSeriesConfig,
};

self.addEventListener('message', (event: MessageEvent<SeriesProcessorRequest>) => {
  const message = event.data;
  if (!message || message.type !== 'process') {
    return;
  }
  try {
    const data = defaultizeSeries({
      series: message.payload.series,
      colors: message.payload.colors,
      theme: message.payload.theme,
      seriesConfig: seriesConfig as never,
    });
    const response: SeriesProcessorResponse = {
      type: 'success',
      id: message.id,
      data,
    };
    self.postMessage(response);
  } catch (err) {
    const response: SeriesProcessorResponse = {
      type: 'error',
      id: message.id,
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
});
