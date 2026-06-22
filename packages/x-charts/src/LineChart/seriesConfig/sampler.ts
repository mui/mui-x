import type { SamplingStrategy } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import { buildLineSamplingData } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/sampling.line';

/**
 * Index-extrema LOD pyramid over the line's displayed y values. Powers the `minmax` and `m4`
 * algorithms; `lttb` reduces on demand from the same stored values.
 * Series containing null points are not sampled (so gaps render exactly).
 */
export const lineSampler: SamplingStrategy<'line'> = {
  build: (series) => {
    if (series.data.some((value) => value == null)) {
      return null;
    }
    return buildLineSamplingData(Float64Array.from(series.visibleStackedData, (point) => point[1]));
  },
};
