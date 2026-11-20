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
    const { visibleStackedData, data, hidden, stack } = series;
    const baselineValue = getBarBaselineValue(series.baseline);
    const low = new Float64Array(visibleStackedData.length);
    const high = new Float64Array(visibleStackedData.length);
    for (let index = 0; index < visibleStackedData.length; index += 1) {
      const [start, end] = getBarExtent(
        visibleStackedData[index],
        hidden ? null : data[index],
        baselineValue,
        stack !== undefined,
      );
      low[index] = Math.min(start, end);
      high[index] = Math.max(start, end);
    }
    return buildSamplingPyramid(low, high);
  },

  sample,

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
