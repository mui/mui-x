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
