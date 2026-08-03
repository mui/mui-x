import type { ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import { getNormalizedAxisScale } from './getAxisScale';

describe('getNormalizedAxisScale - shared domain cache', () => {
  it('does not return a band scale for a point axis sharing the same domain array', () => {
    const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const bandAxis = { scaleType: 'band', data } as any;
    const pointAxis = { scaleType: 'point', data } as any;

    const bandwidthOf = (axis: any) =>
      (getNormalizedAxisScale(axis, data) as ScaleBand<any>).bandwidth();

    const band = getNormalizedAxisScale(bandAxis, data);
    const point = getNormalizedAxisScale(pointAxis, data);

    // Band has a non-zero bandwidth; point has zero bandwidth.
    expect(bandwidthOf(bandAxis)).to.be.greaterThan(0);
    expect(bandwidthOf(pointAxis)).to.equal(0);
    expect(band).not.to.equal(point);

    // Cache hit must preserve the scale type rather than returning the other variant.
    expect(bandwidthOf(bandAxis)).to.be.greaterThan(0);
    expect(bandwidthOf(pointAxis)).to.equal(0);
  });
});
