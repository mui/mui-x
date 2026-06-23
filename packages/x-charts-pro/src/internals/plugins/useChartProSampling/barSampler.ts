import { type SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/** Min/max LOD pyramid over the bar's stacked `[base, top]` envelope (min base, max top). */
export const barSampler: SamplingStrategy<'bar', SamplingPyramid> = {
  build: (series) =>
    buildSamplingPyramid(
      Float64Array.from(series.visibleStackedData, (point) => point[0]),
      Float64Array.from(series.visibleStackedData, (point) => point[1]),
    ),

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
