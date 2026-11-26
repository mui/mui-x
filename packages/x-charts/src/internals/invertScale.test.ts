import { describe, it, expect } from 'vitest';
import type { D3OrdinalScale } from '../models/axis';
import { scaleBand, scalePoint } from './scales';
import { getDataIndexForOrdinalScaleValue, invertScale } from './invertScale';

const data = ['A', 'B', 'C', 'D'];
const band = (range: [number, number]) => scaleBand(data, range) as unknown as D3OrdinalScale;
const point = (range: [number, number]) => scalePoint(data, range) as unknown as D3OrdinalScale;

describe('getDataIndexForOrdinalScaleValue', () => {
  it('maps band positions to data indexes on an ascending range', () => {
    const scale = band([0, 400]);

    expect(
      [10, 110, 210, 390].map((v) => getDataIndexForOrdinalScaleValue(scale, v)),
    ).to.deep.equal([0, 1, 2, 3]);
  });

  it('maps band positions to data indexes on a descending range', () => {
    const scale = band([400, 0]);

    expect(
      [390, 290, 190, 10].map((v) => getDataIndexForOrdinalScaleValue(scale, v)),
    ).to.deep.equal([0, 1, 2, 3]);
  });

  it('maps point positions to the nearest data index on both range directions', () => {
    const ascending = point([0, 300]);
    const descending = point([300, 0]);

    expect(
      [0, 140, 160, 300].map((v) => getDataIndexForOrdinalScaleValue(ascending, v)),
    ).to.deep.equal([0, 1, 2, 3]);
    expect(
      [300, 160, 140, 0].map((v) => getDataIndexForOrdinalScaleValue(descending, v)),
    ).to.deep.equal([0, 1, 2, 3]);
  });
});

describe('invertScale', () => {
  it('returns the data value under the position on a descending band range', () => {
    const scale = band([400, 0]);

    expect(invertScale(scale, data, 390)).to.equal('A');
    expect(invertScale(scale, data, 10)).to.equal('D');
  });
});
