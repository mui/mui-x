import type { ChartSeriesType, DatasetType } from '../../../models/seriesType/config';
import type { AllSeriesType, SeriesId } from '../../../models/seriesType';
import type {
  DefaultizedSeriesGroups,
  SeriesIdToType,
} from '../corePlugins/useChartSeries/useChartSeries.types';

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
      /** Composite `${chartId}:${perChartRequestId}` — unique across all charts on the page. */
      requestId: string;
      payload: ChartsAsyncWorkerSeriesDefaultizePayload;
    }
  | ({
      kind: 'series-defaultize:done';
      sessionId: string;
      requestId: string;
    } & ChartsAsyncWorkerSeriesDefaultizeResult)
  | {
      kind: 'series-defaultize:error';
      sessionId: string;
      requestId: string;
      errorMessage: string;
    };

export interface ChartsAsyncRunner {
  runSeriesDefaultize(
    payload: ChartsAsyncWorkerSeriesDefaultizePayload,
    /**
     * Composite request id, e.g. `${chartId}:${perChartReqId}`. The runner
     * uses it to route the worker's response back to this caller. The
     * routing requires uniqueness across every chart on the page —
     * appending the chart's id to its local request counter is the simplest
     * way to satisfy that without module-level mutable state.
     */
    requestId: string,
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
      `[mui-x-charts][${Date.now()}] opening persistent channel; crossOriginIsolated =`,
      (globalThis as any).crossOriginIsolated,
      '; SAB available =',
      typeof SharedArrayBuffer !== 'undefined',
    );
    persistentChannel.addEventListener(
      'message',
      (event: MessageEvent<ChartsAsyncWorkerMessage>) => {
        const msg = event.data;
        if (
          msg?.kind === 'pong' &&
          msg.sessionId === persistentSessionId &&
          installedRunner === null &&
          persistentChannel !== null &&
          persistentSessionId !== null
        ) {
          // eslint-disable-next-line no-console
          console.log(`[mui-x-charts][${Date.now()}] worker discovered via BroadcastChannel pong`);
          installedRunner = buildRunner(persistentChannel, persistentSessionId);
        }
      },
    );
  }

  // Re-ping every time we get called without an installed runner. Cheap
  // fire-and-forget; lets a late-booting worker still answer.
  const pingAt = Date.now();
  // eslint-disable-next-line no-console
  console.log(`[mui-x-charts][${pingAt}] sending ping`);
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
          `[mui-x-charts][${Date.now()}] no worker pong within`,
          MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS,
          'ms (ping was at',
          pingAt,
          ') — falling back to main thread (will retry on next request)',
        );
        resolve(null);
      }
    }, MUI_X_CHARTS_ASYNC_PROBE_TIMEOUT_MS);
  });
}

function buildRunner(channel: BroadcastChannel, sessionId: string): ChartsAsyncRunner {
  const pending = new Map<
    string,
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
          // Strip non-cloneable fields (functions, React elements/components,
          // class instances) from each series — `postMessage` over
          // `BroadcastChannel` uses structured-clone which throws on any
          // non-serializable value. The worker only needs the data shape to
          // compute ids/colors; non-cloneable fields like `valueFormatter`
          // are re-attached on the main thread after the worker responds.
          channel.postMessage({
            kind: 'series-defaultize',
            sessionId,
            requestId,
            payload: {
              ...payload,
              series: payload.series.map(stripNonCloneable),
            },
          } satisfies ChartsAsyncWorkerMessage);
        } catch (err) {
          console.error('[mui-x-charts] postMessage threw', err);
          pending.delete(requestId);
          reject(err as Error);
        }
      });
    },
  };
}

/**
 * Returns a deep copy of `value` with non-cloneable values dropped. Used to
 * sanitize the series array before sending it across `BroadcastChannel`.
 *
 * Drops: functions, React elements (objects with a `$$typeof` symbol),
 * class instances other than `Date`/typed-arrays/`ArrayBuffer`.
 * Preserves: primitives, plain objects, arrays, typed-array views,
 * `ArrayBuffer`s (including SAB-backed), `Date`s, `Map`/`Set`.
 */
function stripNonCloneable<T>(value: T): T {
  return cloneOrDrop(value, new WeakMap()) as T;
}

/**
 * Re-attaches non-cloneable fields (functions, React components) from the
 * original series array onto the worker's defaultized result. The worker
 * sees only the cloneable subset of each series, so e.g. `valueFormatter`
 * and slot components disappear during the round-trip; this puts them back.
 *
 * Matches by series `id` — `defaultizeSeries` either echoes the
 * user-provided id or assigns `auto-generated-id-${seriesIndex}`. We
 * re-derive the auto-id locally to cover the fallback case.
 */
export function reattachNonCloneableSeriesFields(
  defaultizedSeries: Record<string, { series: Record<string, any>; seriesOrder: SeriesId[] }>,
  originalSeries: ReadonlyArray<{ id?: SeriesId; [key: string]: unknown }>,
): typeof defaultizedSeries {
  const originalById = new Map<SeriesId, { [key: string]: unknown }>();
  originalSeries.forEach((s, index) => {
    const id = s.id ?? (`auto-generated-id-${index}` as SeriesId);
    originalById.set(id, s);
  });

  for (const type of Object.keys(defaultizedSeries)) {
    const group = defaultizedSeries[type];
    if (!group) {
      continue;
    }
    for (const id of Object.keys(group.series) as SeriesId[]) {
      const original = originalById.get(id);
      if (!original) {
        continue;
      }
      const defaultized = group.series[id] as Record<string, unknown>;
      for (const key of Object.keys(original)) {
        const v = original[key];
        if (
          typeof v === 'function' ||
          (v != null &&
            typeof v === 'object' &&
            (v as { $$typeof?: unknown }).$$typeof !== undefined)
        ) {
          defaultized[key] = v;
        }
      }
    }
  }
  return defaultizedSeries;
}

function cloneOrDrop(value: unknown, seen: WeakMap<object, unknown>): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  const t = typeof value;
  if (t === 'function' || t === 'symbol') {
    return undefined;
  }
  if (t !== 'object') {
    return value;
  }
  if (seen.has(value as object)) {
    return seen.get(value as object);
  }
  // Pass through structured-cloneable built-ins (typed arrays carry their
  // numeric buffers; structured clone handles them natively).
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Map ||
    value instanceof Set ||
    value instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer) ||
    ArrayBuffer.isView(value)
  ) {
    return value;
  }
  // React elements / Material UI slot components carry a `$$typeof` symbol —
  // not cloneable. Drop them; the main thread re-attaches originals.
  if ((value as { $$typeof?: unknown }).$$typeof !== undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const arr: unknown[] = [];
    seen.set(value, arr);
    for (let i = 0; i < value.length; i += 1) {
      const cloned = cloneOrDrop(value[i], seen);
      arr.push(cloned);
    }
    return arr;
  }
  // Plain object. Skip class instances with non-standard prototypes
  // (defensive — most likely class instances aren't cloneable either).
  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype) {
    return undefined;
  }
  const out: Record<string, unknown> = {};
  seen.set(value, out);
  for (const key of Object.keys(value as Record<string, unknown>)) {
    const cloned = cloneOrDrop((value as Record<string, unknown>)[key], seen);
    if (cloned !== undefined) {
      out[key] = cloned;
    }
  }
  return out;
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
