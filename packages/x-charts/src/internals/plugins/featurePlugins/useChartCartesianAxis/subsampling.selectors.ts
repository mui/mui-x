import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { buildSubsamplingPyramid, getSubsamplingStrategy } from './subsampling';
import type { SubsamplingPyramidLookup } from './subsampling.types';

const EMPTY_PYRAMIDS: SubsamplingPyramidLookup = {};

export const selectorChartSubsamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'subsampling'
> = (state) => state.subsampling;

/**
 * LOD pyramids per series, keyed by series id. Rebuilt only on data change (memoized).
 * Only bar series are subsampled today; other chart types plug in here.
 */
export const selectorChartSubsamplingPyramids = createSelectorMemoized(
  selectorChartSubsamplingState,
  selectorChartSeriesProcessed,
  function selectorChartSubsamplingPyramids(
    subsamplingState,
    processedSeries,
  ): SubsamplingPyramidLookup {
    const barSeries = processedSeries.bar;
    if (!subsamplingState?.enabled || !barSeries) {
      return EMPTY_PYRAMIDS;
    }

    const strategy = getSubsamplingStrategy(subsamplingState.strategy);
    const pyramids: SubsamplingPyramidLookup = {};
    for (const seriesId of barSeries.seriesOrder) {
      const series = barSeries.series[seriesId];
      pyramids[seriesId] = buildSubsamplingPyramid(series.visibleStackedData, strategy);
    }

    return pyramids;
  },
);
