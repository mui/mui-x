/* eslint-disable no-restricted-globals */
/**
 * Web Worker entry that runs `applySeriesProcessors` for line, bar, and scatter series.
 *
 * The main thread sends defaultized series (with function fields stripped), the dataset,
 * and a per-type set of hidden series ids. The worker re-runs the per-type
 * `seriesProcessor` (statically imported here) and posts the resulting `ProcessedSeries`
 * back. The main thread then re-attaches function fields and stores the result.
 *
 * @internal
 */

import lineSeriesProcessor from '../../../../LineChart/seriesConfig/seriesProcessor';
import barSeriesProcessor from '../../../../BarChart/seriesConfig/bar/seriesProcessor';
import scatterSeriesProcessor from '../../../../ScatterChart/seriesConfig/seriesProcessor';
import { type DefaultizedSeriesGroups } from '../useChartSeries/useChartSeries.types';
import { type DatasetType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type IsItemVisibleFunction } from '../../featurePlugins/useChartVisibilityManager';

interface WorkerInput {
  defaultizedSeries: DefaultizedSeriesGroups;
  dataset?: DatasetType;
  hiddenIds: Record<string, SeriesId[]>;
}

const PROCESSORS: Record<string, (...args: any[]) => any> = {
  line: lineSeriesProcessor,
  bar: barSeriesProcessor,
  scatter: scatterSeriesProcessor,
};

/** Strip function-typed fields from the processed output so it can be posted back. */
function stripFunctions(input: unknown): unknown {
  if (input === null || input === undefined) {
    return input;
  }
  if (Array.isArray(input)) {
    // Arrays are kept as-is (arrays of paths/numbers etc.). We don't recurse into
    // typed-array-like sequences for performance; the function fields we strip live
    // on plain series objects.
    return input;
  }
  if (typeof input !== 'object') {
    if (typeof input === 'function') {
      return undefined;
    }
    return input;
  }
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(input as Record<string, unknown>)) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === 'function') {
      continue;
    }
    out[key] = value;
  }
  return out;
}

function stripFunctionsFromGroup(group: Record<string, unknown>): Record<string, unknown> {
  const seriesIn = group.series as Record<string, unknown>;
  const seriesOut: Record<string, unknown> = {};
  for (const id of Object.keys(seriesIn)) {
    seriesOut[id] = stripFunctions(seriesIn[id]);
  }
  // stackingGroups carries d3-stack helper functions (`stackingOrder`, `stackingOffset`)
  // that aren't needed after processing — downstream code only reads `ids` and `length`.
  const stackingGroupsRaw = group.stackingGroups as Array<Record<string, unknown>> | undefined;
  const stackingGroups = stackingGroupsRaw?.map((g) => stripFunctions(g));
  return { ...group, series: seriesOut, ...(stackingGroups ? { stackingGroups } : {}) };
}

self.addEventListener('message', (event: MessageEvent<WorkerInput>) => {
  const t0 = performance.now();
  const { defaultizedSeries, dataset, hiddenIds } = event.data;

  const isItemVisible: IsItemVisibleFunction = ({ type, seriesId }) => {
    const ids = hiddenIds[type as string];
    if (!ids) {
      return true;
    }
    return !ids.some((id) => id === seriesId);
  };

  const processed: Record<string, unknown> = {};
  for (const type of Object.keys(defaultizedSeries)) {
    const group = (defaultizedSeries as Record<string, unknown>)[type];
    const processor = PROCESSORS[type];
    if (!group || !processor) {
      continue;
    }
    const result = processor(group, dataset, isItemVisible);
    processed[type] = stripFunctionsFromGroup(result);
  }

  const processingMs = performance.now() - t0;
  (self as unknown as Worker).postMessage({ processed, processingMs });
});
