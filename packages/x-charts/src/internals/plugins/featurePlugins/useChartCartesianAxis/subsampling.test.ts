import {
  MIN_ELEMENT_SIZE_PX,
  buildSubsamplingPyramid,
  getSubsamplingStrategy,
  getSubsamplingMinSpan,
  selectSubsamplingLevel,
  selectSubsamplingLevelByZoom,
} from './subsampling';

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

const envelope = getSubsamplingStrategy('minMaxEnvelope');

describe('buildSubsamplingPyramid', () => {
  it('stores one level per power-of-two bucket size, starting at 2', () => {
    const pyramid = buildSubsamplingPyramid(stacked, envelope);

    expect(pyramid.dataLength).to.equal(8);
    expect(pyramid.levels.map((level) => level.bucketSize)).to.deep.equal([2, 4, 8]);
  });

  it('aggregates each bucket with the min/max envelope', () => {
    const pyramid = buildSubsamplingPyramid(stacked, envelope);

    expect(pyramid.levels[0].buckets).to.deep.equal([
      { startIndex: 0, endIndex: 1, low: 0, high: 5 },
      { startIndex: 2, endIndex: 3, low: 0, high: 8 },
      { startIndex: 4, endIndex: 5, low: 0, high: 7 },
      { startIndex: 6, endIndex: 7, low: 0, high: 6 },
    ]);
    expect(pyramid.levels[2].buckets).to.deep.equal([
      { startIndex: 0, endIndex: 7, low: 0, high: 8 },
    ]);
  });

  it('clamps the last bucket when the length is not a power of two', () => {
    const pyramid = buildSubsamplingPyramid(stacked.slice(0, 5), envelope);

    expect(pyramid.levels.map((level) => level.bucketSize)).to.deep.equal([2, 4, 8]);
    expect(pyramid.levels[0].buckets.at(-1)).to.deep.equal({
      startIndex: 4,
      endIndex: 4,
      low: 0,
      high: 3,
    });
    expect(pyramid.levels[2].buckets).to.deep.equal([
      { startIndex: 0, endIndex: 4, low: 0, high: 8 },
    ]);
  });

  it('produces no levels for one or zero data points', () => {
    expect(buildSubsamplingPyramid([], envelope).levels).to.have.length(0);
    expect(buildSubsamplingPyramid([[0, 1]], envelope).levels).to.have.length(0);
  });
});

describe('bar subsampling strategies', () => {
  it('max keeps the peak over a zero base', () => {
    expect(getSubsamplingStrategy('max')(stacked, 0, 3)).to.deep.equal({ low: 0, high: 8 });
  });

  it('average means the tops', () => {
    expect(getSubsamplingStrategy('average')(stacked, 0, 3)).to.deep.equal({ low: 0, high: 4 });
  });

  it('stride keeps the first point of the bucket', () => {
    expect(getSubsamplingStrategy('stride')(stacked, 2, 5)).to.deep.equal({ low: 0, high: 2 });
  });
});

describe('selectSubsamplingLevelByZoom', () => {
  const pyramid = buildSubsamplingPyramid(stacked, envelope); // levels: bucketSize 2, 4, 8

  it('renders every point (no sampling) at max zoom (span === minSpan)', () => {
    expect(selectSubsamplingLevelByZoom(10, 10, pyramid)).to.equal(null);
    // Still rounds down to level 0 just above max zoom.
    expect(selectSubsamplingLevelByZoom(13, 10, pyramid)).to.equal(null);
  });

  it('halves the points (bucket size x2) for each doubling of the span', () => {
    expect(selectSubsamplingLevelByZoom(20, 10, pyramid)?.bucketSize).to.equal(2);
    expect(selectSubsamplingLevelByZoom(40, 10, pyramid)?.bucketSize).to.equal(4);
    expect(selectSubsamplingLevelByZoom(80, 10, pyramid)?.bucketSize).to.equal(8);
  });

  it('clamps to the coarsest level when fully zoomed out', () => {
    expect(selectSubsamplingLevelByZoom(100, 10, pyramid)?.bucketSize).to.equal(8);
  });

  it('returns null for non-positive spans', () => {
    expect(selectSubsamplingLevelByZoom(0, 10, pyramid)).to.equal(null);
    expect(selectSubsamplingLevelByZoom(50, 0, pyramid)).to.equal(null);
  });
});

describe('getSubsamplingMinSpan (screen + data driven level count)', () => {
  // 800px / 4px = 200 bars capacity.
  it('shrinks the min zoom span as the data grows', () => {
    expect(getSubsamplingMinSpan(400, 800)).to.equal(50);
    expect(getSubsamplingMinSpan(4000, 800)).to.equal(5);
  });

  it('grows the min zoom span as the available size shrinks', () => {
    // Narrower chart fits fewer bars, so fewer levels are needed.
    expect(getSubsamplingMinSpan(4000, 800)).to.equal(5);
    expect(getSubsamplingMinSpan(4000, 400)).to.equal(2.5);
  });

  it('yields more (coarser) levels at full zoom-out for more data', () => {
    const small = buildSubsamplingPyramid(makeStacked(400), envelope);
    const large = buildSubsamplingPyramid(makeStacked(4000), envelope);

    const smallTop = selectSubsamplingLevelByZoom(100, getSubsamplingMinSpan(400, 800), small);
    const largeTop = selectSubsamplingLevelByZoom(100, getSubsamplingMinSpan(4000, 800), large);

    expect(largeTop!.bucketSize).to.be.greaterThan(smallTop!.bucketSize);
  });

  it('reaches the unsampled level at max zoom for any data size', () => {
    const large = buildSubsamplingPyramid(makeStacked(4000), envelope);
    const minSpan = getSubsamplingMinSpan(4000, 800);

    expect(selectSubsamplingLevelByZoom(minSpan, minSpan, large)).to.equal(null);
  });
});

describe('selectSubsamplingLevel', () => {
  const pyramid = buildSubsamplingPyramid(stacked, envelope);

  it('returns null when bars are at least the minimum width', () => {
    expect(selectSubsamplingLevel(MIN_ELEMENT_SIZE_PX, pyramid)).to.equal(null);
    expect(selectSubsamplingLevel(MIN_ELEMENT_SIZE_PX + 1, pyramid)).to.equal(null);
  });

  it('picks the smallest level that brings the slot back above the minimum width', () => {
    // 4 / 2 = 2px -> needs one level (bucketSize 2).
    expect(selectSubsamplingLevel(2, pyramid)?.bucketSize).to.equal(2);
    // 4 / 1 = needs factor 4 -> bucketSize 4.
    expect(selectSubsamplingLevel(1, pyramid)?.bucketSize).to.equal(4);
  });

  it('clamps to the coarsest level for tiny bars', () => {
    expect(selectSubsamplingLevel(0.01, pyramid)?.bucketSize).to.equal(8);
  });

  it('returns null for non-positive width or an empty pyramid', () => {
    expect(selectSubsamplingLevel(0, pyramid)).to.equal(null);
    expect(selectSubsamplingLevel(-5, pyramid)).to.equal(null);
    expect(selectSubsamplingLevel(0.5, buildSubsamplingPyramid([[0, 1]], envelope))).to.equal(
      null,
    );
  });
});
