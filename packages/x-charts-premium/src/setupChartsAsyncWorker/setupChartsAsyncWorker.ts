import {
  defaultizeSeries,
  MUI_X_CHARTS_ASYNC_CHANNEL,
  type ChartsAsyncWorkerMessage,
  type ChartSeriesConfig,
  type ChartSeriesType,
} from '@mui/x-charts/internals';
import { defaultSeriesConfigPremium } from '../internals/defaultSeriesConfigPremium';

export interface SetupChartsAsyncWorkerOptions<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> {
  /**
   * The seriesConfig the worker should use to defaultize series. Defaults to
   * `defaultSeriesConfigPremium`. Pass a customized config (e.g. spread the
   * default and add user-defined series types) so the worker matches whatever
   * is wired into the chart on the main thread.
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
    defaultSeriesConfigPremium) as ChartSeriesConfig<SeriesType>;
  const channel = new BroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);

  channel.addEventListener('message', (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
    const msg = event.data;
    if (!msg) {
      return;
    }

    if (msg.kind === 'ping') {
      channel.postMessage({
        kind: 'pong',
        sessionId: msg.sessionId,
      } satisfies ChartsAsyncWorkerMessage);
      return;
    }

    if (msg.kind === 'series-defaultize') {
      try {
        const { defaultizedSeries, idToType } = defaultizeSeries({
          series: msg.payload.series as any,
          colors: msg.payload.colors,
          theme: msg.payload.theme,
          seriesConfig,
        });
        channel.postMessage({
          kind: 'series-defaultize:done',
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          defaultizedSeries,
          idToTypeEntries: Array.from(idToType.entries()),
        } satisfies ChartsAsyncWorkerMessage);
      } catch (err) {
        channel.postMessage({
          kind: 'series-defaultize:error',
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          errorMessage: (err as Error).message,
        } satisfies ChartsAsyncWorkerMessage);
      }
    }
  });
}
