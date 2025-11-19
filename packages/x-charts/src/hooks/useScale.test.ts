import { scaleBand } from '@mui/x-charts/internals';
import { scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { getValueToPositionMapper } from './useScale';

describe('getValueToPositionMapper', () => {
  it('returns a function that maps values to their position for ordinal scales', () => {
    const scale = scaleBand(['A', 'B', 'C'], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper('B')).toBeCloseTo(0.5);
  });

  it('properly handles array of arrays as input for band scales', () => {
    const scale = scaleBand(
      [
        [0, 0],
        [2, 8],
        [10, 10],
      ],
      [0, 1],
    );

    const mapper = getValueToPositionMapper(scale);

    expect(mapper([2, 8])).toEqual(0.5);
  });

  it('returns a function that maps values to their position for continuous scales', () => {
    const scale = scaleLinear([0, 10], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper(5)).toBeCloseTo(0.5);
  });

  it('returns a function that returns NaN for continuous scales whose domain has zero size and the value is outside the domain', () => {
    const scale = scaleLinear([10, 10], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper(11)).toBeNaN();
    expect(mapper(5)).toBeNaN();
  });

  it('returns a function that returns applies the scale for continuous scales whose domain has zero size and the value is inside the domain', () => {
    const scale = scaleLinear([10, 10], [0, 1]);

    const mapper = getValueToPositionMapper(scale);

    expect(mapper(10)).to.eq(0.5);
  });
});
