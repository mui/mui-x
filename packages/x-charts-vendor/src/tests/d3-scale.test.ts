import { expect } from 'chai';

import {
  scaleLinear,
  scaleLog,
  scalePow,
  scaleSqrt,
} from '@mui/x-charts-vendor/d3-scale';

describe('d3-scale', () => {
  it('exports valid functions', () => {
    expect(scaleLinear).instanceOf(Function);
    expect(scaleLog).instanceOf(Function);
    expect(scalePow).instanceOf(Function);
    expect(scaleSqrt).instanceOf(Function);
  });
});
