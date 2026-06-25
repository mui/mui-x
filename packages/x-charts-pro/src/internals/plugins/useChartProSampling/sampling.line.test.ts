import type { SampledBucket } from '@mui/x-charts/internals';
import { buildSamplingPyramid, MIN_ELEMENT_SIZE_PX } from './sampling';
import { sampleBuckets, largestTriangleThreeBuckets } from './sampling.line';

const f64 = (values: number[]) => Float64Array.from(values);

// Pixel size for which the screen-derived min span equals `minSpan` (so tests keep using spans).
const pxFor = (minSpan: number, dataLength: number) =>
  (minSpan * MIN_ELEMENT_SIZE_PX * dataLength) / 100;

// Flatten the per-bucket indices into the ascending polyline indices a line series renders.
const flat = (buckets: SampledBucket[] | null) =>
  buckets && buckets.flatMap((bucket) => Array.from(bucket.indices));

describe('sampleBuckets', () => {
  //                      idx: 0  1  2  3  4  5  6  7
  const values = f64([3, 1, 4, 8, 5, 2, 6, 7]);
  const pyramid = buildSamplingPyramid(values, values);
  const px = pxFor(10, values.length); // min span 10
  const getValues = () => values;

  it('returns null at max zoom (no sampling)', () => {
    expect(sampleBuckets(pyramid, 10, px, 0, 'm4', getValues)).to.equal(null);
  });

  it('minmax keeps the two extrema indices per bucket, sorted', () => {
    // span/minSpan = 2 -> level 0 (bucketSize 2)
    const buckets = sampleBuckets(pyramid, 20, px, 0, 'minmax', getValues);
    // buckets [3,1] [4,8] [5,2] [6,7] -> sorted [min,max] per bucket
    expect(flat(buckets)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('defaults to minmax (bar series pass no algorithm)', () => {
    expect(flat(sampleBuckets(pyramid, 20, px, 0))).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('reports each bucket index span for the merged bar geometry', () => {
    // bucketSize 4: buckets [0..3] [4..7]
    const buckets = sampleBuckets(pyramid, 40, px, 0, 'minmax', getValues)!;
    expect(buckets.map((b) => [b.startIndex, b.endIndex])).to.deep.equal([
      [0, 3],
      [4, 7],
    ]);
  });

  it('m4 keeps first/min/max/last per bucket (deduped, sorted)', () => {
    // span/minSpan = 4 -> level 1 (bucketSize 4): buckets [0..3] [4..7]
    const buckets = sampleBuckets(pyramid, 40, px, 0, 'm4', getValues);
    // bucket 0: first 0, min idx1, max idx3, last 3 -> [0,1,3]
    // bucket 1: first 4, min idx5, max idx7, last 7 -> [4,5,7]
    expect(flat(buckets)).to.deep.equal([0, 1, 3, 4, 5, 7]);
  });

  it('lttb reduces to roughly dataLength / bucketSize points incl. endpoints', () => {
    const big = f64(Array.from({ length: 64 }, (_, i) => Math.sin(i)));
    const bigPyramid = buildSamplingPyramid(big, big);
    const buckets = sampleBuckets(bigPyramid, 40, pxFor(10, 64), 0, 'lttb', () => big)!; // level 1 -> ~16
    expect(buckets).to.have.lengthOf(1); // lttb is one whole-range bucket
    const indices = flat(buckets)!;
    expect(indices.length).to.equal(16);
    expect(indices[0]).to.equal(0);
    expect(indices[indices.length - 1]).to.equal(63);
  });

  it('only reads values for lttb (getValues not called otherwise)', () => {
    let called = 0;
    const spy = () => {
      called += 1;
      return values;
    };
    sampleBuckets(pyramid, 40, px, 0, 'm4', spy);
    expect(called).to.equal(0);
    sampleBuckets(pyramid, 40, px, 0, 'lttb', spy);
    expect(called).to.equal(1);
  });
});

describe('sampleBuckets with null gaps', () => {
  // null at index 5: low +Inf / high -Inf so it's never picked as an extremum.
  const low = f64([3, 1, 4, 8, 5, Infinity, 6, 7]);
  const high = f64([3, 1, 4, 8, 5, -Infinity, 6, 7]);
  const pyramid = buildSamplingPyramid(low, high);
  pyramid.nullIndices = Int32Array.from([5]);
  const px = pxFor(10, 8);

  it('merges the null index into its bucket and excludes it from the envelope', () => {
    // bucketSize 4: buckets [0..3] [4..7]; null idx 5 lands in the second bucket.
    // Second bucket envelope is min idx4 / max idx7, plus the null break at 5.
    const buckets = sampleBuckets(pyramid, 40, px, 0, 'minmax')!;
    expect(Array.from(buckets[1].indices)).to.deep.equal([4, 5, 7]);
    expect(flat(buckets)).to.deep.equal([1, 3, 4, 5, 7]);
  });

  it('breaks the lttb output at gaps too', () => {
    const indices = flat(sampleBuckets(pyramid, 40, px, 0, 'lttb', () => low))!;
    expect(indices).to.include(5);
  });
});

describe('largestTriangleThreeBuckets', () => {
  it('returns all indices when threshold >= length', () => {
    expect(Array.from(largestTriangleThreeBuckets(f64([1, 2, 3]), 5))).to.deep.equal([0, 1, 2]);
  });

  it('keeps first and last and hits the threshold count', () => {
    const values = f64(Array.from({ length: 100 }, (_, i) => Math.sin(i / 5)));
    const out = largestTriangleThreeBuckets(values, 10);
    expect(out.length).to.equal(10);
    expect(out[0]).to.equal(0);
    expect(out[9]).to.equal(99);
    for (let i = 1; i < out.length; i += 1) {
      expect(out[i]).to.be.greaterThan(out[i - 1]);
    }
  });
});
