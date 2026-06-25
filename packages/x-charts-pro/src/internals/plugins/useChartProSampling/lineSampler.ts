import type { SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Min/max LOD pyramid over the line's displayed y values (single channel: low === high).
 * Powers `minmax` and `m4`; `lttb` reduces on demand from the same series values.
 * Series containing null points are not sampled (so gaps render exactly).
 */
export const lineSampler: SamplingStrategy<'line', SamplingPyramid> = {
  build: (series) => {
    if (series.data.some((value) => value == null)) {
      return null;
    }
    const y = Float64Array.from(series.visibleStackedData, (point) => point[1]);
    return buildSamplingPyramid(y, y);
  },

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
