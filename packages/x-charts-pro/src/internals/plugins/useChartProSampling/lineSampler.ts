import type { SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Min/max LOD pyramid over the line's displayed y values. Null-free series use a single channel
 * (`low === high === y`). When nulls exist, the min channel gets `+Inf` and the max channel `-Inf`
 * at those points so they're never picked as an extremum, and their indices are collected in
 * `nullIndices` for the sampler to merge back in so the line breaks at gaps instead of bridging them.
 */
export const lineSampler: SamplingStrategy<'line', SamplingPyramid> = {
  build: (series) => {
    const { data, visibleStackedData } = series;
    const length = visibleStackedData.length;
    const values = new Float64Array(length);
    let nullIndices: number[] | null = null;

    for (let i = 0; i < length; i += 1) {
      if (data[i] == null) {
        (nullIndices ??= []).push(i);
      } else {
        values[i] = visibleStackedData[i][1];
      }
    }

    if (!nullIndices) {
      return buildSamplingPyramid(values, values);
    }

    // Split into two channels only when there are gaps: nulls lose both extrema comparisons.
    const low = values;
    const high = Float64Array.from(values);
    for (let i = 0; i < nullIndices.length; i += 1) {
      low[nullIndices[i]] = Infinity;
      high[nullIndices[i]] = -Infinity;
    }
    const pyramid = buildSamplingPyramid(low, high);
    pyramid.nullIndices = Int32Array.from(nullIndices);
    return pyramid;
  },

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
