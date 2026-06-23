import { type SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingMinSpan, getSamplingBucketSize } from './sampling';
import { selectLineSampledIndices } from './sampling.line';
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

  sampleLineIndices: (context) => {
    const pyramid = context.built as SamplingPyramid;
    const { zoom } = context;
    if (!zoom) {
      return null;
    }
    return selectLineSampledIndices(
      pyramid,
      zoom.end - zoom.start,
      getSamplingMinSpan(pyramid.dataLength, context.availableSize),
      context.algorithm,
      context.getValues,
    );
  },

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(
      span,
      getSamplingMinSpan(context.dataLength, context.availableSize),
      context.dataLength,
    ),

  minSpanFor: (context) => getSamplingMinSpan(context.dataLength, context.availableSize),
};
