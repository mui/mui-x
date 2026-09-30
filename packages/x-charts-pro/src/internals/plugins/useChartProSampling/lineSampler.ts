import type { SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Min/max LOD pyramid over the line's y values (single channel when null-free). Nulls get `+Inf`
 * low / `-Inf` high so they never win an extremum, and go into `nullIndices` for the sampler to
 * re-insert as line breaks.
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

    // Two channels only when gaps exist: nulls lose both extrema comparisons.
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
