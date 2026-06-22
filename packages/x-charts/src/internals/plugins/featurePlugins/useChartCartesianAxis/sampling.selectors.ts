import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import type { SampledSeriesLookup } from './sampling.types';

const EMPTY_PYRAMIDS: SampledSeriesLookup = {};

export const selectorChartSamplingState: ChartRootSelector<
  UseChartCartesianAxisSignature,
  'sampling'
> = (state) => state.sampling;

/**
 * Built sampling structures per series, keyed by series id. Rebuilt only on data change (memoized).
 * Iterates every series type whose `seriesConfig` registers a `sampler` (bar, line, …); the
 * type-specific plot hook reads the structure back and renders the active level of detail.
 */
export const selectorChartSamplingPyramids = createSelectorMemoized(
  selectorChartSamplingState,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  function selectorChartSamplingPyramids(
    samplingState,
    processedSeries,
    seriesConfig,
  ): SampledSeriesLookup {
    if (!samplingState?.enabled) {
      return EMPTY_PYRAMIDS;
    }

    let sampled: SampledSeriesLookup | undefined;
    (Object.keys(processedSeries) as ChartSeriesType[]).forEach((seriesType) => {
      const sampler = seriesConfig[seriesType]?.sampler;
      const typeData = processedSeries[seriesType];
      if (!sampler || !typeData) {
        return;
      }

      for (const seriesId of typeData.seriesOrder) {
        const built = sampler.build(typeData.series[seriesId] as never);
        if (built) {
          sampled ??= {};
          sampled[seriesId] = built;
        }
      }
    });

    return sampled ?? EMPTY_PYRAMIDS;
  },
);
