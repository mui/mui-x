import type { SamplingStrategy } from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize } from './sampling';
import { sample } from './sampling.line';
import type { SamplingPyramid } from './sampling.pyramid.types';

/**
 * Min/max LOD pyramid over the line's displayed y values (single channel: low === high).
 * Powers `minmax` and `m4`; `lttb` reduces on demand from the same series values.
 *
 * Null points are excluded from the envelope (`+Inf` low / `-Inf` high, so they're never picked as
 * an extremum) and collected in `nullIndices`, which the sampler merges back in so the line still
 * breaks at gaps instead of bridging them.
 */
export const lineSampler: SamplingStrategy<'line', SamplingPyramid> = {
  build: (series) => {
    const { data, visibleStackedData } = series;
    const length = visibleStackedData.length;
    const low = new Float64Array(length);
    const high = new Float64Array(length);
    let nullIndices: number[] | null = null;

    for (let i = 0; i < length; i += 1) {
      if (data[i] == null) {
        low[i] = Infinity;
        high[i] = -Infinity;
        (nullIndices ??= []).push(i);
      } else {
        const y = visibleStackedData[i][1];
        low[i] = y;
        high[i] = y;
      }
    }

    const pyramid = buildSamplingPyramid(low, high);
    if (nullIndices) {
      pyramid.nullIndices = Int32Array.from(nullIndices);
    }
    return pyramid;
  },

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
