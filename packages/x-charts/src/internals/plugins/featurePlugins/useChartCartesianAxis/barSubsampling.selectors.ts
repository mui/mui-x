import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { buildBarSubsamplingPyramid, getBarSubsamplingStrategy } from './barSubsampling';
import type { BarSubsamplingPyramidLookup } from './barSubsampling.types';

const EMPTY_PYRAMIDS: BarSubsamplingPyramidLookup = {};

export const selectorChartBarSubsamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'barSubsampling'
> = (state) => state.barSubsampling;

/** LOD pyramids per bar series, keyed by series id. Rebuilt only on data change (memoized). */
export const selectorChartBarSubsamplingPyramids = createSelectorMemoized(
  selectorChartBarSubsamplingState,
  selectorChartSeriesProcessed,
  function selectorChartBarSubsamplingPyramids(
    subsamplingState,
    processedSeries,
  ): BarSubsamplingPyramidLookup {
    const barSeries = processedSeries.bar;
    if (!subsamplingState?.enabled || !barSeries) {
      return EMPTY_PYRAMIDS;
    }

    const strategy = getBarSubsamplingStrategy(subsamplingState.strategy);
    const pyramids: BarSubsamplingPyramidLookup = {};
    for (const seriesId of barSeries.seriesOrder) {
      const series = barSeries.series[seriesId];
      pyramids[seriesId] = buildBarSubsamplingPyramid(series.visibleStackedData, strategy);
    }

    return pyramids;
  },
);
