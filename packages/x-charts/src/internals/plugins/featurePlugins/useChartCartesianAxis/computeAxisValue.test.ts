import { scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { scaleRangeAndTickNumber } from './computeAxisValue';

describe('scaleRangeAndTickNumber', () => {
  it('returns the input if the extrema match the scale domain', () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const minData = 0;
    const maxData = 10;
    const tickNumber = 4;

    const result = scaleRangeAndTickNumber(scale, minData, maxData, tickNumber);

    expect(result.range).to.deep.equal([0, 100]);
    expect(result.tickNumber).to.equal(4);
  });

  it('doubles the range and tick number if the extrema span is half the domain span', () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const minData = 2.5;
    const maxData = 7.5;
    const tickNumber = 4;

    const result = scaleRangeAndTickNumber(scale, minData, maxData, tickNumber);

    expect(result.range).to.deep.equal([-50, 150]);
    expect(result.tickNumber).to.equal(8);
  });

  it('doubles the range and tick number if the extrema span is half the domain span and the range is decreasing', () => {
    const scale = scaleLinear([0, 10], [100, 0]);
    const minData = 2.5;
    const maxData = 7.5;
    const tickNumber = 4;

    const result = scaleRangeAndTickNumber(scale, minData, maxData, tickNumber);

    expect(result.range).to.deep.equal([150, -50]);
    expect(result.tickNumber).to.equal(8);
  });

  it('scales the range and tick number if the extrema span is not centered on the domain span', () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const minData = 1;
    const maxData = 6;
    const tickNumber = 4;

    const result = scaleRangeAndTickNumber(scale, minData, maxData, tickNumber);

    expect(result.range).to.deep.equal([-20, 180]);
    expect(result.tickNumber).to.equal(8);
  });

  it('handles extrema being equal', () => {
    const scale = scaleLinear([0, 10], [0, 100]);
    const minData = 5;
    const maxData = 5;
    const tickNumber = 4;

    const result = scaleRangeAndTickNumber(scale, minData, maxData, tickNumber);

    expect(result.range).to.deep.equal([0, 100]);
    expect(result.tickNumber).to.equal(0);
  });
});
