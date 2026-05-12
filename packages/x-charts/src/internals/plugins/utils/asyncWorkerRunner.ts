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

let installedRunner: ChartsAsyncRunner | null = null;
let persistentChannel: BroadcastChannel | null = null;
let persistentSessionId: string | null = null;

/**
 * Lazily probes the BroadcastChannel for a worker that called
 * `setupChartsAsyncWorker()` and returns the resolved runner (or `null` if
 * none is reachable within the probe window).
 *
 * - Returns `null` synchronously when `BroadcastChannel` isn't available
 *   (SSR, very old browsers).
 * - Otherwise opens the channel on the first call, posts a `ping`, and keeps
 *   listening for `pong` indefinitely. The first call's returned promise
 *   resolves on pong or after `MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS`,
 *   whichever comes first. If the timeout wins but the worker pongs later
 *   (cold-start race), the runner is still installed — and subsequent calls
 *   to `getChartsAsyncRunner()` synchronously return the installed runner.
 *
 * Each call without an installed runner re-pings; if the worker is slow to
 * boot, a later defaultize will trigger discovery as soon as the worker is
 * alive.
 * @returns {Promise<ChartsAsyncRunner | null>} The runner if a worker pongs, otherwise `null`.
 */
export function getChartsAsyncRunner(): Promise<ChartsAsyncRunner | null> {
  if (installedRunner !== null) {
    return Promise.resolve(installedRunner);
  }
  if (typeof BroadcastChannel === 'undefined') {
    return Promise.resolve(null);
  }

  if (persistentChannel === null) {
    persistentSessionId = generateSessionId();
    persistentChannel = new BroadcastChannel(MUI_X_CHARTS_ASYNC_CHANNEL);
    // eslint-disable-next-line no-console
    console.log(
      '[mui-x-charts] opening persistent channel; crossOriginIsolated =',
      (globalThis as any).crossOriginIsolated,
      '; SAB available =',
      typeof SharedArrayBuffer !== 'undefined',
    );
    persistentChannel.addEventListener('message', (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
      const msg = event.data;
      if (
        msg?.kind === 'pong' &&
        msg.sessionId === persistentSessionId &&
        installedRunner === null &&
        persistentChannel !== null &&
        persistentSessionId !== null
      ) {
        // eslint-disable-next-line no-console
        console.log('[mui-x-charts] worker discovered via BroadcastChannel pong');
        installedRunner = buildRunner(persistentChannel, persistentSessionId);
      }
    });
  }

  // Re-ping every time we get called without an installed runner. Cheap
  // fire-and-forget; lets a late-booting worker still answer.
  persistentChannel.postMessage({
    kind: 'ping',
    sessionId: persistentSessionId!,
  } satisfies ChartsAsyncWorkerMessage);

  return new Promise<ChartsAsyncRunner | null>((resolve) => {
    setTimeout(() => {
      if (installedRunner !== null) {
        resolve(installedRunner);
      } else {
        // eslint-disable-next-line no-console
        console.log(
          '[mui-x-charts] no worker pong within',
          MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS,
          'ms — falling back to main thread (will retry on next request)',
        );
        resolve(null);
      }
    }, MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS);
  });
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
      // eslint-disable-next-line no-console
      console.log('[mui-x-charts] worker response received', {
        requestId: msg.requestId,
        defaultizedSeriesKeys: Object.keys(msg.defaultizedSeries ?? {}),
      });
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
        // eslint-disable-next-line no-console
        console.log('[mui-x-charts] dispatching series-defaultize to worker', { requestId });
        try {
          channel.postMessage({
            kind: 'series-defaultize',
            sessionId,
            requestId,
            payload,
          } satisfies ChartsAsyncWorkerMessage);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[mui-x-charts] postMessage threw', err);
          pending.delete(requestId);
          reject(err as Error);
        }
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
 * Test helper — clears the persistent channel state so a fresh probe runs on
 * the next call to `getChartsAsyncRunner()`. Not for production use.
 */
export function resetChartsAsyncRunnerForTests(): void {
  if (persistentChannel !== null) {
    persistentChannel.close();
  }
  persistentChannel = null;
  persistentSessionId = null;
  installedRunner = null;
}
