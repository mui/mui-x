import type { ChartSeriesType, DatasetType } from '../../../models/seriesType/config';
import type { AllSeriesType, SeriesId } from '../../../models/seriesType';
import type { DefaultizedSeriesGroups, SeriesIdToType } from '../corePlugins/useChartSeries/useChartSeries.types';

/**
 * BroadcastChannel name used for ambient discovery + message passing between
 * the chart on the main thread and a Web Worker that calls
 * `setupChartsAsyncWorker()` from `@mui/x-charts-premium`. Same-origin only.
 */
export const MUI_X_CHARTS_ASYNC_CHANNEL = 'mui-x-charts-async';

/**
 * Time the chart waits for a `pong` after sending the initial `ping`. If no
 * worker responds within this window, the chart memoizes "no worker" and
 * stays on the main-thread path for the rest of the page lifetime. Kept low
 * so the first defaultize after page load isn't perceptibly delayed.
 */
export const MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS = 10;

export type ChartsAsyncWorkerSeriesDefaultizePayload<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = {
  series: ReadonlyArray<AllSeriesType<SeriesType>>;
  colors: ReadonlyArray<string>;
  theme: 'light' | 'dark';
  dataset?: Readonly<DatasetType>;
};

export type ChartsAsyncWorkerSeriesDefaultizeResult<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = {
  defaultizedSeries: DefaultizedSeriesGroups<SeriesType>;
  /**
   * `idToType` shipped over `postMessage` as entries — `Map` survives
   * structured-clone in modern browsers, but we serialize anyway for stability.
   */
  idToTypeEntries: ReadonlyArray<readonly [SeriesId, ChartSeriesType]>;
};

export type ChartsAsyncWorkerMessage =
  | { kind: 'ping'; sessionId: string }
  | { kind: 'pong'; sessionId: string }
  | {
      kind: 'series-defaultize';
      sessionId: string;
      requestId: number;
      payload: ChartsAsyncWorkerSeriesDefaultizePayload;
    }
  | ({
      kind: 'series-defaultize:done';
      sessionId: string;
      requestId: number;
    } & ChartsAsyncWorkerSeriesDefaultizeResult)
  | {
      kind: 'series-defaultize:error';
      sessionId: string;
      requestId: number;
      errorMessage: string;
    };

export interface ChartsAsyncRunner {
  runSeriesDefaultize(
    payload: ChartsAsyncWorkerSeriesDefaultizePayload,
    requestId: number,
  ): Promise<{
    defaultizedSeries: DefaultizedSeriesGroups;
    idToType: SeriesIdToType;
  }>;
}

let cachedRunnerPromise: Promise<ChartsAsyncRunner | null> | null = null;

/**
 * Lazily probes the BroadcastChannel for a worker that called
 * `setupChartsAsyncWorker()`. Memoized for the page lifetime: the probe runs
 * at most once.
 *
 * - Returns `null` synchronously when `BroadcastChannel` isn't available
 *   (SSR, very old browsers).
 * - Otherwise opens the channel, posts a `ping`, and resolves with a runner
 *   on the first matching `pong`. If no pong arrives within
 *   `MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS`, closes the channel and resolves
 *   with `null`.
 *
 * The runner correlates `series-defaultize:done` / `:error` responses by
 * `sessionId` (matching this page) and `requestId` (matching this request).
 * Responses from workers in other tabs (cross-tab `BroadcastChannel`) are
 * dropped via the `sessionId` filter.
 * @returns {Promise<ChartsAsyncRunner | null>} The runner if a worker pongs, otherwise `null`.
 */
export function getChartsAsyncRunner(): Promise<ChartsAsyncRunner | null> {
  if (cachedRunnerPromise !== null) {
    return cachedRunnerPromise;
  }
  if (typeof BroadcastChannel === 'undefined') {
    cachedRunnerPromise = Promise.resolve(null);
    return cachedRunnerPromise;
  }

  cachedRunnerPromise = new Promise<ChartsAsyncRunner | null>((resolve) => {
    const sessionId = generateSessionId();
    const channel = new BroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    let settled = false;
    let timeoutHandle: ReturnType<typeof setTimeout>;

    const probeListener = (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
      if (settled) {
        return;
      }
      const msg = event.data;
      if (msg?.kind === 'pong' && msg.sessionId === sessionId) {
        settled = true;
        clearTimeout(timeoutHandle);
        channel.removeEventListener('message', probeListener);
        resolve(buildRunner(channel, sessionId));
      }
    };

    timeoutHandle = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      channel.removeEventListener('message', probeListener);
      channel.close();
      resolve(null);
    }, MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS);

    channel.addEventListener('message', probeListener);
    channel.postMessage({ kind: 'ping', sessionId } satisfies ChartsAsyncWorkerMessage);
  });

  return cachedRunnerPromise;
}

function buildRunner(channel: BroadcastChannel, sessionId: string): ChartsAsyncRunner {
  const pending = new Map<
    number,
    {
      resolve: (result: {
        defaultizedSeries: DefaultizedSeriesGroups;
        idToType: SeriesIdToType;
      }) => void;
      reject: (err: Error) => void;
    }
  >();

  channel.addEventListener('message', (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
    const msg = event.data;
    if (!msg || msg.sessionId !== sessionId) {
      return;
    }
    if (msg.kind === 'series-defaultize:done') {
      const entry = pending.get(msg.requestId);
      if (!entry) {
        return;
      }
      pending.delete(msg.requestId);
      entry.resolve({
        defaultizedSeries: msg.defaultizedSeries,
        idToType: new Map(msg.idToTypeEntries),
      });
      return;
    }
    if (msg.kind === 'series-defaultize:error') {
      const entry = pending.get(msg.requestId);
      if (!entry) {
        return;
      }
      pending.delete(msg.requestId);
      entry.reject(new Error(msg.errorMessage));
    }
  });

  return {
    runSeriesDefaultize(payload, requestId) {
      return new Promise((resolve, reject) => {
        pending.set(requestId, { resolve, reject });
        channel.postMessage({
          kind: 'series-defaultize',
          sessionId,
          requestId,
          payload,
        } satisfies ChartsAsyncWorkerMessage);
      });
    },
  };
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `mui-x-charts-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

/**
 * Test helper — clears the memoized probe promise so a fresh probe runs on
 * the next call to `getChartsAsyncRunner()`. Not for production use.
 */
export function resetChartsAsyncRunnerForTests(): void {
  cachedRunnerPromise = null;
}
