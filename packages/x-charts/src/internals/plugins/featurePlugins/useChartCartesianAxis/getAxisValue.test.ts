import { scaleBand, scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { describe } from 'vitest';
import { getAxisValue } from './getAxisValue';

describe('getAxisValue', () => {
  it('returns the inverted value when the scale is ordinal', () => {
    const scale = scaleBand();

    expect(getAxisValue(scale, ['A', 'B', 'C', 'D'], 600, 2)).to.eq('C');
  });

  it('returns the inverted value when the scale is continuous', () => {
    const scale = scaleLinear([0, 100], [0, 1000]);

    expect(getAxisValue(scale, [], 500, null)).to.eq(50);
  });

  it('returns `null` when the scale is continuous and its domain is not finite', () => {
    const scale = scaleLinear([Infinity, -Infinity]);

    expect(getAxisValue(scale, [], 500, null)).to.eq(null);
  });
});
