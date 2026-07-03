import {
  MAX_RENDERED_POINTS,
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

// `selectSamplingLevel` takes an available pixel size and derives min-span internally; this is the
// pixel size for which `getSamplingMinSpan(dataLength, px) === minSpan` (so tests keep using spans).
const pxFor = (minSpan: number, dataLength = values.length) =>
  (minSpan * MIN_ELEMENT_SIZE_PX * dataLength) / 100;

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

describe('selectSamplingLevel (screen-defined levels, minSpan = 0)', () => {
  const pyramid = buildSamplingPyramid(values, values); // levels: bucketSize 2, 4, 8
  const noMinSpan = 0; // isolate the screen-defined behaviour

  it('returns null at max zoom (elements wide enough)', () => {
    expect(selectSamplingLevel(pyramid, 10, pxFor(10), noMinSpan)).to.equal(null);
    expect(selectSamplingLevel(pyramid, 13, pxFor(10), noMinSpan)).to.equal(null);
  });

  it('picks a coarser level (bucket size x2) for each doubling of the span', () => {
    expect(selectSamplingLevel(pyramid, 20, pxFor(10), noMinSpan)?.bucketSize).to.equal(2);
    expect(selectSamplingLevel(pyramid, 40, pxFor(10), noMinSpan)?.bucketSize).to.equal(4);
    expect(selectSamplingLevel(pyramid, 80, pxFor(10), noMinSpan)?.bucketSize).to.equal(8);
  });

  it('exposes the level slice as [start, end) offsets into argMin/argMax', () => {
    const level = selectSamplingLevel(pyramid, 40, pxFor(10), noMinSpan)!; // bucketSize 4
    expect(level.start).to.equal(pyramid.offsets[1]);
    expect(level.end).to.equal(pyramid.offsets[2]);
  });

  it('clamps to the coarsest level when fully zoomed out', () => {
    expect(selectSamplingLevel(pyramid, 100, pxFor(10), noMinSpan)?.bucketSize).to.equal(8);
  });

  it('returns null for non-positive spans or a zero-size / empty pyramid', () => {
    expect(selectSamplingLevel(pyramid, 0, pxFor(10), noMinSpan)).to.equal(null);
    expect(selectSamplingLevel(pyramid, 50, 0, noMinSpan)).to.equal(null); // zero px -> no sampling
    expect(
      selectSamplingLevel(buildSamplingPyramid(f64([5]), f64([5])), 50, pxFor(10), noMinSpan),
    ).to.equal(null);
  });
});

describe('selectSamplingLevel — level 0 (raw) at the deepest zoom', () => {
  const pyramid = buildSamplingPyramid(values, values);
  const tinyScreen = pxFor(1); // screen threshold 1, so minSpan drives level 0

  it('renders raw a half-octave above minSpan (wiggle room), then samples', () => {
    // RAW_LEVEL_SPAN_FACTOR = sqrt(2) ≈ 1.414, so level 0 covers span up to ~14.14 at minSpan 10.
    expect(selectSamplingLevel(pyramid, 14, tinyScreen, 10)).to.equal(null);
    expect(selectSamplingLevel(pyramid, 15, tinyScreen, 10)).to.not.equal(null);
  });

  it('renders raw at minSpan when the visible point count is under the cap', () => {
    const large = buildSamplingPyramid(
      makeValues(MAX_RENDERED_POINTS),
      makeValues(MAX_RENDERED_POINTS),
    );
    expect(selectSamplingLevel(large, 10, tinyScreen, 10)).to.equal(null);
  });
});

describe('selectSamplingLevel — MAX_RENDERED_POINTS cap (samples even in the raw zone)', () => {
  it('samples the deepest zoom when more than the cap is visible, whatever the element size', () => {
    // 4x the cap fully in view, deepest zoom (span === minSpan): raw rule alone would render it all.
    const count = MAX_RENDERED_POINTS * 4;
    const pyramid = buildSamplingPyramid(makeValues(count), makeValues(count));
    const tinyScreen = (1 * MIN_ELEMENT_SIZE_PX * count) / 100; // screen threshold 1 -> never samples
    const level = selectSamplingLevel(pyramid, 100, tinyScreen, 100); // span 100, minSpan 100 -> raw zone
    expect(level).to.not.equal(null);
    // 4x over the cap -> 2 levels up -> bucket size 4 -> length / 4 === cap rendered.
    expect(level!.bucketSize).to.equal(4);
    expect(count / level!.bucketSize).to.equal(MAX_RENDERED_POINTS);
  });

  it('stays raw when the visible point count is at or under the cap', () => {
    const atCap = makeValues(MAX_RENDERED_POINTS);
    const pyramid = buildSamplingPyramid(atCap, atCap);
    const tinyScreen = (1 * MIN_ELEMENT_SIZE_PX * MAX_RENDERED_POINTS) / 100;
    expect(selectSamplingLevel(pyramid, 100, tinyScreen, 100)).to.equal(null);
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

    const smallTop = selectSamplingLevel(small, 100, 800, 0);
    const largeTop = selectSamplingLevel(large, 100, 800, 0);

    expect(largeTop!.bucketSize).to.be.greaterThan(smallTop!.bucketSize);
  });

  it('reaches the unsampled level at max zoom for any data size', () => {
    const large = buildSamplingPyramid(makeValues(4000), makeValues(4000));
    // At max zoom the span equals the screen-derived min span.
    expect(selectSamplingLevel(large, getSamplingMinSpan(4000, 800), 800, 0)).to.equal(null);
  });
});
