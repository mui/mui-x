import type { SamplingStrategy } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import { buildSamplingPyramid } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling';

/** Min/max LOD pyramid over the bar's stacked `[base, top]` envelope. */
export const barSampler: SamplingStrategy<'bar'> = {
  build: (series) => buildSamplingPyramid(series.visibleStackedData),
};
