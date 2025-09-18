import { scaleBand, scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { getValueToPositionMapper } from './useScale';

describe('getValueToPositionMapper', () => {
  it('returns a function that maps values to their position for ordinal scales', () => {
    const scale = scaleBand<string | number | Date>(['A', 'B', 'C'], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper('B')).toBeCloseTo(0.5);
  });

  it('returns a function that maps values to their position for continuous scales', () => {
    const scale = scaleLinear([0, 10], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper(5)).toBeCloseTo(0.5);
  });

  it('returns a function that returns NaN for continuous scales whose domain has zero size', () => {
    const scale = scaleLinear([10, 10], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper(10)).toBeNaN();
    expect(mapper(5)).toBeNaN();
  });
});
