import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesProcessors } from './processSeries';
import { selectorIsItemVisibleGetter } from '../../featurePlugins/useChartVisibilityManager';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig/useChartSeriesConfig.selectors';

// Read the async-series-processor state by direct path to avoid an import cycle
// with `useChartAsyncSeriesProcessor`.
const selectorAsyncEnabled = (state: { asyncSeriesProcessor?: { enabled: boolean } }) =>
  state.asyncSeriesProcessor?.enabled ?? false;
const selectorAsyncProcessedSeries = (state: {
  asyncSeriesProcessor?: { enabled: boolean; processedSeries: unknown };
}) =>
  state.asyncSeriesProcessor?.enabled
    ? (state.asyncSeriesProcessor.processedSeries as ReturnType<typeof applySeriesProcessors>)
    : null;

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

export const selectorChartDefaultizedSeries = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.defaultizedSeries,
);

/**
 * Get the dataset from the series state.
 * @returns {DatasetType | undefined} The dataset.
 */
export const selectorChartsDataset = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.dataset,
);

const EMPTY_PROCESSED_SERIES = {} as ReturnType<typeof applySeriesProcessors>;

/**
 * Get the processed series after applying series processors.
 *
 * When the chart's `asyncProcessing` flag is enabled, the work is done in a Web Worker
 * by `useChartAsyncSeriesProcessor`. This selector then returns the worker's output if
 * available, or an empty processed-series shape while the worker is still busy. Empty
 * keeps every downstream consumer (axes, tooltip, highlight) safe — the chart's loading
 * overlay handles the user-facing skeleton.
 *
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessed = createSelectorMemoized(
  selectorChartDefaultizedSeries,
  selectorChartSeriesConfig,
  selectorChartsDataset,
  selectorIsItemVisibleGetter,
  selectorAsyncEnabled,
  selectorAsyncProcessedSeries,
  function selectorChartSeriesProcessed(
    defaultizedSeries,
    seriesConfig,
    dataset,
    isItemVisible,
    asyncEnabled,
    asyncProcessedSeries,
  ) {
    if (asyncEnabled) {
      return asyncProcessedSeries ?? EMPTY_PROCESSED_SERIES;
    }
    return applySeriesProcessors(defaultizedSeries, seriesConfig, dataset, isItemVisible);
  },
);

/**
 * Returns a function that returns the series configuration for a given series id.
 */
export const selectorChartSeriesConfigGetter = createSelectorMemoized(
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  (seriesConfig, processedSeries) => {
    return function getSeriesConfigById(seriesId: SeriesId) {
      for (const type in processedSeries) {
        if (!Object.hasOwn(processedSeries, type)) {
          continue;
        }

        const seriesGroup = processedSeries[type as keyof typeof processedSeries];
        if (seriesGroup?.series) {
          const item = seriesGroup.series[seriesId];
          if (item) {
            return seriesConfig[type as keyof typeof processedSeries];
          }
        }
      }

      return null;
    };
  },
);
