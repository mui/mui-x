import { type ChartPlugin } from '@mui/x-charts/internals';
import { computeSampledIndices } from './sampling/computeSampledIndices';
import { type UseChartProSamplingSignature } from './useChartProSampling.types';

/**
 * Activates render-only downsampling. It puts the `computeSampledIndices` function into the store so
 * the community sampled-indices selector delegates the whole computation to the Pro algorithms. The
 * plugin itself holds no interactive state — the algorithms are static.
 */
export const useChartProSampling: ChartPlugin<UseChartProSamplingSignature> = () => {
  return {};
};

useChartProSampling.params = {};

useChartProSampling.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProSampling.getInitialState = () => ({
  sampling: {
    computeSampledIndices,
  },
});
