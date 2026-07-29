import { scaleBand, scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { getSampledBandHighlight } from './getSampledBandHighlight';
import { createGetBucketBarDimensions } from '../internals/createGetBarDimensions';
import type { D3OrdinalScale } from '../models/axis';

const data = [0, 1, 2, 3, 4, 5, 6, 7];
const halfPaddingOf = (scale: D3OrdinalScale) => (scale.step() - scale.bandwidth()) / 2;

describe('getSampledBandHighlight', () => {
  it('covers a single band when the series is not sampled', () => {
    const scale = scaleBand(data, [0, 800]) as unknown as D3OrdinalScale;
    const { bandStart, bandSize } = getSampledBandHighlight({
      scale,
      value: 3,
      dataIndex: 3,
      data,
      bucketSize: 1,
    });

    expect(bandSize).to.equal(scale.step());
    expect(bandStart).to.equal(scale(3)! - halfPaddingOf(scale));
  });

  // Reversed axis: data[0] is on the right, so the bucket's left edge is data[3] (#22997).
  [
    { reverse: false, leftIndex: 0 },
    { reverse: true, leftIndex: 3 },
  ].forEach(({ reverse, leftIndex }) => {
    it(`anchors a bucket at its left-most slot (reverse: ${reverse})`, () => {
      const scale = scaleBand(data, reverse ? [800, 0] : [0, 800]) as unknown as D3OrdinalScale;
      const { bandStart, bandSize } = getSampledBandHighlight({
        scale,
        value: 1,
        dataIndex: 1,
        data,
        bucketSize: 4,
      });

      expect(bandStart).to.equal(scale(leftIndex)! - halfPaddingOf(scale));
      expect(bandSize).to.equal(4 * scale.step());
    });
  });

  it('clamps the last bucket to the end of the data', () => {
    const oddData = [0, 1, 2];
    const scale = scaleBand(oddData, [0, 800]) as unknown as D3OrdinalScale;

    // bucketSize 2 leaves a trailing bucket holding index 2 alone.
    const { bandStart, bandSize } = getSampledBandHighlight({
      scale,
      value: 2,
      dataIndex: 2,
      data: oddData,
      bucketSize: 2,
    });

    expect(bandStart).to.equal(scale(2)! - halfPaddingOf(scale));
    expect(bandSize).to.equal(scale.step());
  });

  // Date axes build a new Date on each pointer event, so reference-based `indexOf` returned -1 and
  // collapsed the highlight to a single band (#23024).
  it('resolves the bucket of a Date value held in a different reference', () => {
    const dates = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
    ];
    const scale = scaleBand(dates, [0, 800]) as unknown as D3OrdinalScale;

    const { bandStart, bandSize } = getSampledBandHighlight({
      scale,
      value: new Date('2024-02-01'),
      dataIndex: undefined,
      data: dates,
      bucketSize: 2,
    });

    expect(bandStart).to.equal(scale(dates[0])! - halfPaddingOf(scale));
    expect(bandSize).to.equal(2 * scale.step());
  });
});

// The bar and its highlight come from two functions; they must stay centered on each other (#22997).
describe('sampled bucket bar / highlight alignment', () => {
  const bars = Array.from({ length: 64 }, (_, i) => i);

  [false, true].forEach((reverse) => {
    it(`centers the bar under the highlight (reverse: ${reverse})`, () => {
      const bucketSize = 8;
      const scale = scaleBand(bars, reverse ? [600, 0] : [0, 600])
        .paddingInner(0.3)
        .paddingOuter(0.15) as unknown as D3OrdinalScale;
      const getBar = createGetBucketBarDimensions({
        verticalLayout: true,
        xAxisConfig: { scale, data: bars, barGapRatio: 0.1, reverse } as any,
        yAxisConfig: { scale: scaleLinear([0, 100], [200, 0]) } as any,
        series: { hidden: false, minBarSize: 0 } as any,
        numberOfGroups: 1,
      });

      // Bucket covering indices [16..23], highlight hovering index 20.
      const bar = getBar(16, 23, 10, 40, 0);
      const { bandStart, bandSize } = getSampledBandHighlight({
        scale,
        value: 20,
        dataIndex: 20,
        data: bars,
        bucketSize,
      });

      expect(bar.x + bar.width / 2).to.be.closeTo(bandStart + bandSize / 2, 0.5);
      expect(bar.x).to.be.greaterThanOrEqual(bandStart - 0.5);
      expect(bar.x + bar.width).to.be.lessThanOrEqual(bandStart + bandSize + 0.5);
    });
  });
});
