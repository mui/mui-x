import { describe, it, expect } from 'vitest';
import { scaleLinear } from '@mui/x-charts-vendor/d3-scale';
import { scaleBand, scalePoint } from './scales';
import { getIndexToPositionMapper, getOrdinalBandStartMapper } from './getOrdinalBandStartMapper';

describe('getOrdinalBandStartMapper', () => {
  const data = ['a', 'b', 'a', 'a'];

  it('resolves duplicated values by index', () => {
    const scale = scaleBand(data, [0, 400]);
    expect(data.map((_, i) => getOrdinalBandStartMapper(scale, data)(i))).to.deep.equal([
      0, 100, 200, 300,
    ]);
  });

  it('handles reversed ranges', () => {
    const scale = scaleBand(data, [400, 0]);
    expect(data.map((_, i) => getOrdinalBandStartMapper(scale, data)(i))).to.deep.equal([
      300, 200, 100, 0,
    ]);
  });

  it('matches scale(value) for unique values', () => {
    const unique = ['a', 'b', 'c'];
    const scale = scaleBand(unique, [0, 120]).padding(0.2);
    expect(unique.map((_, i) => getOrdinalBandStartMapper(scale, unique)(i))).to.deep.equal(
      unique.map((value) => scale(value)),
    );
  });

  it('returns undefined for out of range indexes', () => {
    const scale = scaleBand(data, [0, 400]);
    expect(getOrdinalBandStartMapper(scale, data)(-1)).to.equal(undefined);
    expect(getOrdinalBandStartMapper(scale, data)(4)).to.equal(undefined);
  });
});

describe('getIndexToPositionMapper', () => {
  it('maps ordinal indexes to the band center', () => {
    const data = ['a', 'a'];
    const toPosition = getIndexToPositionMapper(scaleBand(data, [0, 200]), data);
    expect([toPosition(0), toPosition(1)]).to.deep.equal([50, 150]);
  });

  it('maps point indexes to their point', () => {
    const data = ['a', 'b', 'a'];
    const toPosition = getIndexToPositionMapper(scalePoint(data, [0, 100]), data);
    expect(data.map((_, i) => toPosition(i))).to.deep.equal([0, 50, 100]);
  });

  it('maps continuous indexes through their value', () => {
    const data = [0, 5, 10];
    const toPosition = getIndexToPositionMapper(scaleLinear([0, 10], [0, 100]), data);
    expect(data.map((_, i) => toPosition(i))).to.deep.equal([0, 50, 100]);
  });
});
