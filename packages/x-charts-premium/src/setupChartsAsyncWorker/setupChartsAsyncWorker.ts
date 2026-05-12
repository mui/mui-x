import {
  defaultizeSeries,
  defaultSeriesConfig,
  MUI_X_CHARTS_ASYNC_CHANNEL,
  type ChartsAsyncWorkerMessage,
  type ChartSeriesConfig,
  type ChartSeriesType,
} from '@mui/x-charts/internals';

export interface SetupChartsAsyncWorkerOptions<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> {
  /**
   * The seriesConfig the worker should use to defaultize series. Defaults to
   * the core `defaultSeriesConfig` (bar/scatter/line/pie) — the worker bundle
   * stays light by avoiding premium series types and their React preview
   * components.
   *
   * Pass a customized config (e.g. spread `defaultSeriesConfigPremium` and add
   * user-defined series types) to handle premium types off-thread. Note that
   * importing the premium default brings its preview components into the
   * worker bundle.
   */
  seriesConfig?: ChartSeriesConfig<SeriesType>;
}

/**
 * Wires up a Web Worker entry to handle async series-defaultize requests
 * dispatched by `@mui/x-charts` on the main thread.
 *
 * Call this once from the worker entry that the consumer's bundler ships:
 *
 * ```ts
 * // chartsWorker.ts
 * import { setupChartsAsyncWorker } from '@mui/x-charts-premium';
 * setupChartsAsyncWorker();
 * ```
 *
 * The chart auto-discovers the worker via a `BroadcastChannel` ping; no
 * provider or prop is needed on the React side.
 * @param {SetupChartsAsyncWorkerOptions} options Optional setup overrides.
 */
export function setupChartsAsyncWorker<SeriesType extends ChartSeriesType = ChartSeriesType>(
  options: SetupChartsAsyncWorkerOptions<SeriesType> = {},
): void {
  if (typeof BroadcastChannel === 'undefined') {
    return;
  }
  const seriesConfig = (options.seriesConfig ??
    defaultSeriesConfig) as ChartSeriesConfig<SeriesType>;
  const channel = new BroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);

  // eslint-disable-next-line no-console
  console.log('[chartsWorker] setup; crossOriginIsolated =', (self as any).crossOriginIsolated);
  channel.addEventListener('message', (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
    const msg = event.data;
    // eslint-disable-next-line no-console
    console.log('[chartsWorker] message received', {
      dataType: typeof msg,
      isNull: msg === null,
      keys: msg && typeof msg === 'object' ? Object.keys(msg as any) : undefined,
      kind: (msg as any)?.kind,
    });
    if (!msg) {
      return;
    }

    if (msg.kind === 'ping') {
      // eslint-disable-next-line no-console
      console.log('[chartsWorker] ping received, replying pong', { sessionId: msg.sessionId });
      channel.postMessage({
        kind: 'pong',
        sessionId: msg.sessionId,
      } satisfies ChartsAsyncWorkerMessage);
      return;
    }

    if (msg.kind === 'series-defaultize') {
      // eslint-disable-next-line no-console
      console.log('[chartsWorker] processing series-defaultize', { requestId: msg.requestId });
      try {
        const { defaultizedSeries, idToType } = defaultizeSeries({
          series: msg.payload.series as any,
          colors: msg.payload.colors,
          theme: msg.payload.theme,
          seriesConfig,
        });
        try {
          channel.postMessage({
            kind: 'series-defaultize:done',
            sessionId: msg.sessionId,
            requestId: msg.requestId,
            defaultizedSeries,
            idToTypeEntries: Array.from(idToType.entries()),
          } satisfies ChartsAsyncWorkerMessage);
          // eslint-disable-next-line no-console
          console.log('[chartsWorker] sent series-defaultize:done', { requestId: msg.requestId });
        } catch (postErr) {
          // eslint-disable-next-line no-console
          console.error('[chartsWorker] postMessage of done reply threw', postErr);
          throw postErr;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[chartsWorker] defaultize threw', err);
        try {
          channel.postMessage({
            kind: 'series-defaultize:error',
            sessionId: msg.sessionId,
            requestId: msg.requestId,
            errorMessage: (err as Error).message,
          } satisfies ChartsAsyncWorkerMessage);
        } catch (postErr) {
          // eslint-disable-next-line no-console
          console.error('[chartsWorker] postMessage of error reply threw', postErr);
        }
      }
    }
  });
}
