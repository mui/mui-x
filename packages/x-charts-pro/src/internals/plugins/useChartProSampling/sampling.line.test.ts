import { buildSamplingPyramid } from './sampling';
import { selectLineSampledIndices, largestTriangleThreeBuckets } from './sampling.line';

const f64 = (values: number[]) => Float64Array.from(values);

describe('selectLineSampledIndices', () => {
  //                      idx: 0  1  2  3  4  5  6  7
  const values = f64([3, 1, 4, 8, 5, 2, 6, 7]);
  const pyramid = buildSamplingPyramid(values, values);
  const getValues = () => values;

  it('returns null at max zoom (no sampling)', () => {
    expect(selectLineSampledIndices(pyramid, 10, 10, 'm4', getValues)).to.equal(null);
  });

  it('minmax keeps the two extrema indices per bucket, sorted', () => {
    // span/minSpan = 2 -> level 0 (bucketSize 2)
    const indices = selectLineSampledIndices(pyramid, 20, 10, 'minmax', getValues);
    // buckets [3,1] [4,8] [5,2] [6,7] -> sorted [min,max] per bucket
    expect(Array.from(indices!)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('m4 keeps first/min/max/last per bucket (deduped, sorted)', () => {
    // span/minSpan = 4 -> level 1 (bucketSize 4): buckets [0..3] [4..7]
    const indices = selectLineSampledIndices(pyramid, 40, 10, 'm4', getValues);
    // bucket 0: first 0, min idx1, max idx3, last 3 -> [0,1,3]
    // bucket 1: first 4, min idx5, max idx7, last 7 -> [4,5,7]
    expect(Array.from(indices!)).to.deep.equal([0, 1, 3, 4, 5, 7]);
  });

  it('lttb reduces to roughly dataLength / bucketSize points incl. endpoints', () => {
    const big = f64(Array.from({ length: 64 }, (_, i) => Math.sin(i)));
    const bigPyramid = buildSamplingPyramid(big, big);
    const indices = selectLineSampledIndices(bigPyramid, 40, 10, 'lttb', () => big); // level 1 -> ~16
    expect(indices!.length).to.equal(16);
    expect(indices![0]).to.equal(0);
    expect(indices![indices!.length - 1]).to.equal(63);
  });

  it('only reads values for lttb (getValues not called otherwise)', () => {
    let called = 0;
    const spy = () => {
      called += 1;
      return values;
    };
    selectLineSampledIndices(pyramid, 40, 10, 'm4', spy);
    expect(called).to.equal(0);
    selectLineSampledIndices(pyramid, 40, 10, 'lttb', spy);
    expect(called).to.equal(1);
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
