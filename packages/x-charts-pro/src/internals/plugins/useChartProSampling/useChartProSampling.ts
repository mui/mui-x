import { type ChartPlugin } from '@mui/x-charts/internals';
import { samplerRegistry } from '../../sampling/samplerRegistry';
import { type UseChartProSamplingSignature } from './useChartProSampling.types';

/**
 * Activates render-only downsampling. It registers the built-in samplers into the store so the
 * community `selectorChartSampledIndices` selector applies them to series that set a `sampling`
 * method. The plugin itself holds no interactive state — the algorithms are static.
 */
export const useChartProSampling: ChartPlugin<UseChartProSamplingSignature> = () => {
  return {};
};

useChartProSampling.params = {};

useChartProSampling.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProSampling.getInitialState = () => ({
  sampling: {
    samplers: samplerRegistry,
  },
});
