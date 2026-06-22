import {
  MIN_ELEMENT_SIZE_PX,
  buildSamplingPyramid,
  getSamplingLevelCount,
  getSamplingMinSpan,
  selectSamplingLevel,
} from './sampling';

const f64 = (values: number[]) => Float64Array.from(values);

// Single-channel sample (low === high === values); the values index 0..7.
const values = f64([3, 1, 4, 8, 5, 2, 6, 7]);

const makeValues = (length: number) => Float64Array.from({ length }, (_, i) => i);

const levelSlice = (
  arr: Int32Array,
  pyramid: ReturnType<typeof buildSamplingPyramid>,
  level: number,
) => Array.from(arr.subarray(pyramid.offsets[level], pyramid.offsets[level + 1]));

describe('buildSamplingPyramid', () => {
  it('stores one level per power-of-two bucket size, starting at 2', () => {
    const pyramid = buildSamplingPyramid(values, values);

    expect(pyramid.dataLength).to.equal(8);
    expect(getSamplingLevelCount(pyramid)).to.equal(3); // bucketSize 2, 4, 8
  });

  it('stores the argMin/argMax index per bucket at level 0', () => {
    const pyramid = buildSamplingPyramid(values, values);
    // buckets [3,1] [4,8] [5,2] [6,7]
    expect(levelSlice(pyramid.argMin, pyramid, 0)).to.deep.equal([1, 2, 5, 6]);
    expect(levelSlice(pyramid.argMax, pyramid, 0)).to.deep.equal([0, 3, 4, 7]);
  });

  it('merges extrema indices to the coarsest level', () => {
    const pyramid = buildSamplingPyramid(values, values);
    const top = getSamplingLevelCount(pyramid) - 1;
    expect(pyramid.argMin[pyramid.offsets[top]]).to.equal(1); // global min value 1 at index 1
    expect(pyramid.argMax[pyramid.offsets[top]]).to.equal(3); // global max value 8 at index 3
  });

  it('keeps separate channels for low (argMin) and high (argMax)', () => {
    // Bar case: low = base (all 0), high = top. argMin ties keep the first index.
    const low = f64([0, 0, 0, 0]);
    const high = f64([1, 5, 2, 8]);
    const pyramid = buildSamplingPyramid(low, high);
    expect(levelSlice(pyramid.argMin, pyramid, 0)).to.deep.equal([0, 2]);
    expect(levelSlice(pyramid.argMax, pyramid, 0)).to.deep.equal([1, 3]);
  });

  it('clamps the last bucket when the length is not a power of two', () => {
    const pyramid = buildSamplingPyramid(values.subarray(0, 5), values.subarray(0, 5));
    expect(getSamplingLevelCount(pyramid)).to.equal(3); // bucketSize 2, 4, 8
    // Last level-0 bucket is the lone trailing point (index 4).
    expect(levelSlice(pyramid.argMin, pyramid, 0).at(-1)).to.equal(4);
    expect(levelSlice(pyramid.argMax, pyramid, 0).at(-1)).to.equal(4);
  });

  it('produces no levels for one or zero data points', () => {
    expect(getSamplingLevelCount(buildSamplingPyramid(f64([]), f64([])))).to.equal(0);
    expect(getSamplingLevelCount(buildSamplingPyramid(f64([5]), f64([5])))).to.equal(0);
  });
});

describe('selectSamplingLevel', () => {
  const pyramid = buildSamplingPyramid(values, values); // levels: bucketSize 2, 4, 8

  it('returns null at max zoom (span === minSpan)', () => {
    expect(selectSamplingLevel(pyramid, 10, 10)).to.equal(null);
    expect(selectSamplingLevel(pyramid, 13, 10)).to.equal(null);
  });

  it('picks a coarser level (bucket size x2) for each doubling of the span', () => {
    expect(selectSamplingLevel(pyramid, 20, 10)?.bucketSize).to.equal(2);
    expect(selectSamplingLevel(pyramid, 40, 10)?.bucketSize).to.equal(4);
    expect(selectSamplingLevel(pyramid, 80, 10)?.bucketSize).to.equal(8);
  });

  it('exposes the level slice as [start, end) offsets into argMin/argMax', () => {
    const level = selectSamplingLevel(pyramid, 40, 10)!; // bucketSize 4 -> level index 1
    expect(level.start).to.equal(pyramid.offsets[1]);
    expect(level.end).to.equal(pyramid.offsets[2]);
  });

  it('clamps to the coarsest level when fully zoomed out', () => {
    expect(selectSamplingLevel(pyramid, 100, 10)?.bucketSize).to.equal(8);
  });

  it('returns null for non-positive spans or an empty pyramid', () => {
    expect(selectSamplingLevel(pyramid, 0, 10)).to.equal(null);
    expect(selectSamplingLevel(pyramid, 50, 0)).to.equal(null);
    expect(selectSamplingLevel(buildSamplingPyramid(f64([5]), f64([5])), 50, 10)).to.equal(null);
  });
});

describe('getSamplingMinSpan (screen + data driven level count)', () => {
  it('is 100% when the data exactly fills the view at the minimum element size', () => {
    expect(getSamplingMinSpan(400, 400 * MIN_ELEMENT_SIZE_PX)).to.equal(100);
  });

  it('shrinks the min zoom span as the data grows', () => {
    expect(getSamplingMinSpan(800, 800)).to.equal(getSamplingMinSpan(400, 800) / 2);
  });

  it('grows the min zoom span as the available size shrinks', () => {
    expect(getSamplingMinSpan(4000, 400)).to.equal(getSamplingMinSpan(4000, 800) / 2);
  });

  it('yields more (coarser) levels at full zoom-out for more data', () => {
    const small = buildSamplingPyramid(makeValues(400), makeValues(400));
    const large = buildSamplingPyramid(makeValues(4000), makeValues(4000));

    const smallTop = selectSamplingLevel(small, 100, getSamplingMinSpan(400, 800));
    const largeTop = selectSamplingLevel(large, 100, getSamplingMinSpan(4000, 800));

    expect(largeTop!.bucketSize).to.be.greaterThan(smallTop!.bucketSize);
  });

  it('reaches the unsampled level at max zoom for any data size', () => {
    const large = buildSamplingPyramid(makeValues(4000), makeValues(4000));
    const minSpan = getSamplingMinSpan(4000, 800);

    expect(selectSamplingLevel(large, minSpan, minSpan)).to.equal(null);
  });
});
