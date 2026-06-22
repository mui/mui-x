import type { SamplingStrategy } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import { buildSamplingPyramid } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling';

/** Min/max LOD pyramid over the bar's stacked `[base, top]` envelope (min base, max top). */
export const barSampler: SamplingStrategy<'bar'> = {
  build: (series) =>
    buildSamplingPyramid(
      Float64Array.from(series.visibleStackedData, (point) => point[0]),
      Float64Array.from(series.visibleStackedData, (point) => point[1]),
    ),
};
