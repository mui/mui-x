import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import {
  type DefaultizedSeriesGroups,
  type ProcessedSeries,
} from '../useChartSeries/useChartSeries.types';

const STRIPPABLE_FUNCTION_FIELDS = new Set(['valueFormatter', 'valueGetter', 'showMark', 'label']);

/**
 * Strip function-typed fields from each series so the structure can be sent through
 * `postMessage`. Functions are restored on the main thread when the worker returns.
 */
export function stripFunctionsFromSeries<T extends ChartSeriesType>(
  defaultized: DefaultizedSeriesGroups<T>,
): DefaultizedSeriesGroups<T> {
  const stripped: Record<string, unknown> = {};
  for (const type of Object.keys(defaultized)) {
    const group = (defaultized as Record<string, any>)[type];
    if (!group) {
      continue;
    }
    const newSeries: Record<string, unknown> = {};
    for (const id of Object.keys(group.series)) {
      const item = group.series[id] as Record<string, unknown>;
      const cleaned: Record<string, unknown> = {};
      for (const key of Object.keys(item)) {
        const value = item[key];
        if (typeof value === 'function' && STRIPPABLE_FUNCTION_FIELDS.has(key)) {
          continue;
        }
        cleaned[key] = value;
      }
      newSeries[id] = cleaned;
    }
    stripped[type] = { ...group, series: newSeries };
  }
  return stripped as DefaultizedSeriesGroups<T>;
}

/**
 * Re-attach function-typed fields from the original (main-thread) defaultized series
 * onto the worker's processed output. The worker only computes numeric fields like
 * `stackedData`, so we keep the originals on the main side and merge here.
 */
export function reattachFunctions<T extends ChartSeriesType>(
  workerOutput: ProcessedSeries<T>,
  originalDefaultized: DefaultizedSeriesGroups<T>,
): ProcessedSeries<T> {
  const merged: Record<string, unknown> = {};
  for (const type of Object.keys(workerOutput)) {
    const workerGroup = (workerOutput as Record<string, any>)[type];
    const origGroup = (originalDefaultized as Record<string, any>)[type];
    if (!workerGroup) {
      continue;
    }
    const series: Record<string, unknown> = {};
    for (const id of Object.keys(workerGroup.series)) {
      const orig = origGroup?.series?.[id];
      const fromWorker = workerGroup.series[id];
      // Spread original first to keep functions; worker fields win for the numeric ones.
      series[id] = { ...orig, ...fromWorker };
    }
    merged[type] = { ...workerGroup, series };
  }
  return merged as ProcessedSeries<T>;
}

export function buildHiddenIdsMap<T extends ChartSeriesType>(
  defaultized: DefaultizedSeriesGroups<T>,
  isItemVisible: (item: { type: T; seriesId: SeriesId }) => boolean,
): Record<string, SeriesId[]> {
  const hidden: Record<string, SeriesId[]> = {};
  for (const type of Object.keys(defaultized) as T[]) {
    const group = (defaultized as Record<string, any>)[type as string];
    if (!group) {
      continue;
    }
    const ids: SeriesId[] = [];
    for (const id of group.seriesOrder) {
      if (!isItemVisible({ type, seriesId: id })) {
        ids.push(id);
      }
    }
    hidden[type as string] = ids;
  }
  return hidden;
}
