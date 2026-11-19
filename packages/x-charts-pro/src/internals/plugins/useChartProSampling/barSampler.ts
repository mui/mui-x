import type { SamplingStrategy } from '@mui/x-charts/internals';
import { getBarBaselineValue, getBarExtent } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Min/max LOD pyramid over the bar's stacked envelope. Uses `min(base, top)`/`max(base, top)` per
 * point rather than base/top directly, so diverging/negative bars (where the stack emits `[0, -5]`,
 * i.e. base > top) keep their full extent instead of being truncated.
 */
export const barSampler: SamplingStrategy<'bar', SamplingPyramid> = {
  build: (series) => {
    const baselineValue = getBarBaselineValue(series.baseline);
    const extents = series.visibleStackedData.map((point, index) =>
      getBarExtent(point, series.data[index], baselineValue),
    );
    return buildSamplingPyramid(
      Float64Array.from(extents, (extent) => Math.min(extent[0], extent[1])),
      Float64Array.from(extents, (extent) => Math.max(extent[0], extent[1])),
    );
  },

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
