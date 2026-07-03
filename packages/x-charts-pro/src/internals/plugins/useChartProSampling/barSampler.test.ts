import { barSampler } from './barSampler';
import { sampleBuckets } from './sampling.line';
import { MIN_ELEMENT_SIZE_PX } from './sampling';

// Pixel size for which the screen-derived min span equals `minSpan` (so tests speak in spans).
const pxFor = (minSpan: number, dataLength: number) =>
  (minSpan * MIN_ELEMENT_SIZE_PX * dataLength) / 100;

describe('barSampler', () => {
  it('keeps the deepest point of diverging/negative bars when buckets merge', () => {
    // Stacked `[base, top]`; a negative bar emits base(0) > top, so the envelope must look at both
    // coords. Deepest bar (-8) is at index 5.
    const tops = [-1, -2, -3, -4, -1, -8, -2, -1];
    const series = { visibleStackedData: tops.map((t) => [0, t]) } as any;
    const pyramid = barSampler.build(series)!;

    // span 80 -> bucketSize 8 -> a single bucket over all 8 points.
    const buckets = sampleBuckets(pyramid, 80, pxFor(10, 8), 0)!;
    const indices = buckets.flatMap((bucket) => Array.from(bucket.indices));

    // The -8 bar must survive the merge; before the fix the low channel tracked base (0) only and
    // dropped it, truncating the merged bar.
    expect(indices).to.include(5);
  });
});
