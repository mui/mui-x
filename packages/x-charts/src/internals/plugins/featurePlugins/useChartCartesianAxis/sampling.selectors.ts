import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { buildSamplingPyramid } from './sampling';
import type { SamplingPyramidLookup } from './sampling.types';

const EMPTY_PYRAMIDS: SamplingPyramidLookup = {};

export const selectorChartSamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'sampling'
> = (state) => state.sampling;

/**
 * LOD pyramids per series, keyed by series id. Rebuilt only on data change (memoized).
 * Only bar series are sampled today; other chart types plug in here.
 */
export const selectorChartSamplingPyramids = createSelectorMemoized(
  selectorChartSamplingState,
  selectorChartSeriesProcessed,
  function selectorChartSamplingPyramids(samplingState, processedSeries): SamplingPyramidLookup {
    const barSeries = processedSeries.bar;
    if (!samplingState?.enabled || !barSeries) {
      return EMPTY_PYRAMIDS;
    }

    const pyramids: SamplingPyramidLookup = {};
    for (const seriesId of barSeries.seriesOrder) {
      pyramids[seriesId] = buildSamplingPyramid(barSeries.series[seriesId].visibleStackedData);
    }

    return pyramids;
  },
);
