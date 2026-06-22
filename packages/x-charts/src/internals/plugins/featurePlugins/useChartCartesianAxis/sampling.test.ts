import {
  MIN_ELEMENT_SIZE_PX,
  buildSamplingPyramid,
  getSamplingLevel,
  getSamplingLevelCount,
  getSamplingMinSpan,
  selectSamplingLevelByZoom,
} from './sampling';

const makeStacked = (length: number): [number, number][] =>
  Array.from({ length }, (_, i) => [0, i]);

// [base, top] pairs as produced by the bar series processor (`visibleStackedData`).
const stacked: [number, number][] = [
  [0, 1],
  [0, 5],
  [0, 2],
  [0, 8],
  [0, 3],
  [0, 7],
  [0, 4],
  [0, 6],
];

describe('buildSamplingPyramid', () => {
  const bucketSizes = (pyramid: ReturnType<typeof buildSamplingPyramid>) =>
    Array.from(
      { length: getSamplingLevelCount(pyramid) },
      (_, i) => getSamplingLevel(pyramid, i).bucketSize,
    );

  it('stores one level per power-of-two bucket size, starting at 2', () => {
    const pyramid = buildSamplingPyramid(stacked);

    expect(pyramid.dataLength).to.equal(8);
    expect(bucketSizes(pyramid)).to.deep.equal([2, 4, 8]);
  });

  it('aggregates each bucket with the min/max envelope', () => {
    const pyramid = buildSamplingPyramid(stacked);

    expect(Array.from(getSamplingLevel(pyramid, 0).min)).to.deep.equal([0, 0, 0, 0]);
    expect(Array.from(getSamplingLevel(pyramid, 0).max)).to.deep.equal([5, 8, 7, 6]);
    expect(Array.from(getSamplingLevel(pyramid, 2).min)).to.deep.equal([0]);
    expect(Array.from(getSamplingLevel(pyramid, 2).max)).to.deep.equal([8]);
  });

  it('clamps the last bucket when the length is not a power of two', () => {
    const pyramid = buildSamplingPyramid(stacked.slice(0, 5));

    expect(bucketSizes(pyramid)).to.deep.equal([2, 4, 8]);
    // Last level-0 bucket covers the lone trailing point (index 4): min 0, max 3.
    expect(getSamplingLevel(pyramid, 0).min.at(-1)).to.equal(0);
    expect(getSamplingLevel(pyramid, 0).max.at(-1)).to.equal(3);
    expect(Array.from(getSamplingLevel(pyramid, 2).min)).to.deep.equal([0]);
    expect(Array.from(getSamplingLevel(pyramid, 2).max)).to.deep.equal([8]);
  });

  it('produces no levels for one or zero data points', () => {
    expect(getSamplingLevelCount(buildSamplingPyramid([]))).to.equal(0);
    expect(getSamplingLevelCount(buildSamplingPyramid([[0, 1]]))).to.equal(0);
  });
});

describe('selectSamplingLevelByZoom', () => {
  const pyramid = buildSamplingPyramid(stacked); // levels: bucketSize 2, 4, 8

  it('renders every point (no sampling) at max zoom (span === minSpan)', () => {
    expect(selectSamplingLevelByZoom(10, 10, pyramid)).to.equal(null);
    // Still rounds down to level 0 just above max zoom.
    expect(selectSamplingLevelByZoom(13, 10, pyramid)).to.equal(null);
  });

  it('halves the points (bucket size x2) for each doubling of the span', () => {
    expect(selectSamplingLevelByZoom(20, 10, pyramid)?.bucketSize).to.equal(2);
    expect(selectSamplingLevelByZoom(40, 10, pyramid)?.bucketSize).to.equal(4);
    expect(selectSamplingLevelByZoom(80, 10, pyramid)?.bucketSize).to.equal(8);
  });

  it('clamps to the coarsest level when fully zoomed out', () => {
    expect(selectSamplingLevelByZoom(100, 10, pyramid)?.bucketSize).to.equal(8);
  });

  it('returns null for non-positive spans or an empty pyramid', () => {
    expect(selectSamplingLevelByZoom(0, 10, pyramid)).to.equal(null);
    expect(selectSamplingLevelByZoom(50, 0, pyramid)).to.equal(null);
    expect(selectSamplingLevelByZoom(50, 10, buildSamplingPyramid([[0, 1]]))).to.equal(null);
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
    // Narrower chart fits fewer bars, so fewer levels are needed.
    expect(getSamplingMinSpan(4000, 400)).to.equal(getSamplingMinSpan(4000, 800) / 2);
  });

  it('yields more (coarser) levels at full zoom-out for more data', () => {
    const small = buildSamplingPyramid(makeStacked(400));
    const large = buildSamplingPyramid(makeStacked(4000));

    const smallTop = selectSamplingLevelByZoom(100, getSamplingMinSpan(400, 800), small);
    const largeTop = selectSamplingLevelByZoom(100, getSamplingMinSpan(4000, 800), large);

    expect(largeTop!.bucketSize).to.be.greaterThan(smallTop!.bucketSize);
  });

  it('reaches the unsampled level at max zoom for any data size', () => {
    const large = buildSamplingPyramid(makeStacked(4000));
    const minSpan = getSamplingMinSpan(4000, 800);

    expect(selectSamplingLevelByZoom(minSpan, minSpan, large)).to.equal(null);
  });
});
