import {
  buildLineSamplingData,
  getLineSamplingLevelCount,
  selectLineSampledIndices,
  largestTriangleThreeBuckets,
} from './sampling.line';

const f64 = (values: number[]) => Float64Array.from(values);

describe('buildLineSamplingData', () => {
  it('stores argMin/argMax indices per bucket at level 0', () => {
    // values:        0  1  2  3  4  5  6  7
    const data = buildLineSamplingData(f64([3, 1, 4, 8, 5, 2, 6, 7]));

    expect(getLineSamplingLevelCount(data)).to.equal(3); // bucketSize 2, 4, 8
    // level 0 buckets: [3,1] [4,8] [5,2] [6,7]
    expect(Array.from(data.argMin.subarray(data.offsets[0], data.offsets[1]))).to.deep.equal([
      1, 2, 5, 6,
    ]);
    expect(Array.from(data.argMax.subarray(data.offsets[0], data.offsets[1]))).to.deep.equal([
      0, 3, 4, 7,
    ]);
  });

  it('merges extrema indices to the coarsest level', () => {
    const data = buildLineSamplingData(f64([3, 1, 4, 8, 5, 2, 6, 7]));
    const top = getLineSamplingLevelCount(data) - 1; // whole-range bucket
    expect(data.argMin[data.offsets[top]]).to.equal(1); // global min value 1 at index 1
    expect(data.argMax[data.offsets[top]]).to.equal(3); // global max value 8 at index 3
  });

  it('produces no levels for one or zero points', () => {
    expect(getLineSamplingLevelCount(buildLineSamplingData(f64([])))).to.equal(0);
    expect(getLineSamplingLevelCount(buildLineSamplingData(f64([5])))).to.equal(0);
  });
});

describe('selectLineSampledIndices', () => {
  const data = buildLineSamplingData(f64([3, 1, 4, 8, 5, 2, 6, 7]));

  it('returns null at max zoom (no sampling)', () => {
    expect(selectLineSampledIndices(data, 10, 10, 'm4')).to.equal(null);
  });

  it('minmax keeps the two extrema indices per bucket, sorted', () => {
    // span/minSpan = 2 -> level 0 (bucketSize 2)
    const indices = selectLineSampledIndices(data, 20, 10, 'minmax');
    // buckets [3,1] [4,8] [5,2] [6,7] -> sorted [min,max] per bucket
    expect(Array.from(indices!)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('m4 keeps first/min/max/last per bucket (deduped, sorted)', () => {
    // span/minSpan = 4 -> level 1 (bucketSize 4): buckets [0..3] [4..7]
    const indices = selectLineSampledIndices(data, 40, 10, 'm4');
    // bucket 0: first 0, min idx1(=1), max idx3(=8), last 3 -> [0,1,3]
    // bucket 1: first 4, min idx5(=2), max idx7(=7), last 7 -> [4,5,7]
    expect(Array.from(indices!)).to.deep.equal([0, 1, 3, 4, 5, 7]);
  });

  it('lttb reduces to roughly dataLength / bucketSize points incl. endpoints', () => {
    const big = buildLineSamplingData(f64(Array.from({ length: 64 }, (_, i) => Math.sin(i))));
    const indices = selectLineSampledIndices(big, 40, 10, 'lttb'); // level 1, bucketSize 4 -> ~16
    expect(indices!.length).to.equal(16);
    expect(indices![0]).to.equal(0);
    expect(indices![indices!.length - 1]).to.equal(63);
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
    // strictly increasing indices
    for (let i = 1; i < out.length; i += 1) {
      expect(out[i]).to.be.greaterThan(out[i - 1]);
    }
  });
});
