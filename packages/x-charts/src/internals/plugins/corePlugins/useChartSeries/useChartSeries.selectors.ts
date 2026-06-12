import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesProcessors } from './processSeries';
import { selectorIsItemVisibleGetter } from '../../featurePlugins/useChartVisibilityManager';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig/useChartSeriesConfig.selectors';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

/**
 * Lifecycle status of the async series-processing pipeline.
 * - 'pending' — defaultize step is queued or running in a microtask
 * - 'success' — last result is committed
 * - 'error' — last result threw; the plugin re-throws this
 */
export const selectorChartSeriesStatus = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.status ?? 'success',
);

/**
 * Last error captured by the async series-processing pipeline (if any).
 */
export const selectorChartSeriesError = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.error,
);

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

/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessed = createSelectorMemoized(
  selectorChartDefaultizedSeries,
  selectorChartSeriesConfig,
  selectorChartsDataset,
  selectorIsItemVisibleGetter,
  function selectorChartSeriesProcessed(defaultizedSeries, seriesConfig, dataset, isItemVisible) {
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
