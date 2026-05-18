import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartSeriesSignature } from './useChartSeries.types';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig/useChartSeriesConfig.selectors';
import { selectorVisibilityMap } from '../../featurePlugins/useChartVisibilityManager/useChartVisibilityManager.selectors';

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

/**
 * Get the processed series after applying the (possibly async) series processors.
 * The processing is performed by the `useChartSeries` plugin effect and written
 * back to the store, so this selector stays synchronous and returns the last
 * settled value.
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessed = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.processed,
);

/**
 * Status of the latest series processing run: `'pending'` while an async
 * processor has not settled yet, `'settled'` otherwise.
 */
export const selectorChartSeriesProcessedStatus = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.processedStatus,
);

/**
 * Memoized tuple of every input the series processors depend on. Used to drive
 * the processing side effect: whenever any of these change, processors re-run.
 * `createSelectorMemoized` keeps the reference stable until an input changes,
 * so the effect only fires on real input changes.
 */
export const selectorChartSeriesProcessingInputs = createSelectorMemoized(
  selectorChartDefaultizedSeries,
  selectorChartsDataset,
  selectorChartSeriesConfig,
  selectorVisibilityMap,
  (defaultizedSeries, dataset, seriesConfig, visibilityMap) =>
    [defaultizedSeries, dataset, seriesConfig, visibilityMap] as const,
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
