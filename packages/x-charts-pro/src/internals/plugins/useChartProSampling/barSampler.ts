import {
  type SamplingStrategy,
  type SampledBar,
  createGetBucketBarDimensions,
} from '@mui/x-charts/internals';
import { buildSamplingPyramid, getSamplingBucketSize, selectSamplingLevel } from './sampling';
import type { SamplingPyramid } from './sampling.pyramid.types';

/** Min/max LOD pyramid over the bar's stacked `[base, top]` envelope (min base, max top). */
export const barSampler: SamplingStrategy<'bar', SamplingPyramid> = {
  build: (series) =>
    buildSamplingPyramid(
      Float64Array.from(series.visibleStackedData, (point) => point[0]),
      Float64Array.from(series.visibleStackedData, (point) => point[1]),
    ),

  sampleBars: (context) => {
    const pyramid = context.built as SamplingPyramid;
    const { zoom } = context;
    if (!zoom) {
      return null;
    }
    const level = selectSamplingLevel(
      pyramid,
      zoom.end - zoom.start,
      context.availableSize,
      context.minSpan,
    );
    if (!level) {
      return null;
    }

    const getBucketBarDimensions = createGetBucketBarDimensions({
      verticalLayout: context.verticalLayout,
      xAxisConfig: context.xAxisConfig,
      yAxisConfig: context.yAxisConfig,
      series: context.series,
      numberOfGroups: context.numberOfGroups,
    });

    const { bucketSize, start, end } = level;
    const { argMin, argMax } = pyramid;
    const stacked = context.series.visibleStackedData;
    const maxIndex = pyramid.dataLength - 1;

    const bars: SampledBar[] = [];
    for (let j = start; j < end; j += 1) {
      const bucket = j - start;
      const startIndex = bucket * bucketSize;
      const endIndex = Math.min(startIndex + bucketSize - 1, maxIndex);
      const low = stacked[argMin[j]][0];
      const high = stacked[argMax[j]][1];
      const dimensions = getBucketBarDimensions(
        startIndex,
        endIndex,
        low,
        high,
        context.groupIndex,
      );
      bars.push({ dataIndex: startIndex, ...dimensions });
    }
    return bars;
  },

  bucketSizeAt: (span, context) =>
    getSamplingBucketSize(span, context.dataLength, context.availableSize, context.minSpan),
};
