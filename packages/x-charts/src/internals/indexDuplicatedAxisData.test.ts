import { describe, it, expect } from 'vitest';
import { getAxisData, getAxisDataValue, indexDuplicatedAxisData } from './indexDuplicatedAxisData';

type Axis = Parameters<typeof indexDuplicatedAxisData>[0];

const indexAxis = (axis: Axis) => indexDuplicatedAxisData(axis);
const tickContext = { location: 'tick', defaultTickLabel: '1' };

describe('indexDuplicatedAxisData', () => {
  it('returns the same axis when there is nothing to index', () => {
    const unique = { scaleType: 'band' as const, data: ['A', 'B'] };
    const continuous = { scaleType: 'linear' as const, data: [1, 1] };
    const dates = { scaleType: 'band' as const, data: [new Date(0), new Date(0)] };
    const noData = { scaleType: 'point' as const };

    expect(indexDuplicatedAxisData(unique)).to.equal(unique);
    expect(indexDuplicatedAxisData(continuous)).to.equal(continuous);
    expect(indexDuplicatedAxisData(dates)).to.equal(dates);
    expect(indexDuplicatedAxisData(noData)).to.equal(noData);
  });

  it('replaces duplicated data by indexes and keeps their reference', () => {
    const data = ['A', 'A', 'B', 'A'];

    const band = indexAxis({ scaleType: 'band', data });
    const point = indexAxis({ scaleType: 'point', data });

    expect(band.data).to.deep.equal([0, 1, 2, 3]);
    expect(point.data).to.equal(band.data);
  });

  it('returns the original values with `getAxisData` and `getAxisDataValue`', () => {
    const unique = { scaleType: 'band', data: ['A', 'B'] };
    const indexed = indexAxis({ scaleType: 'band', data: ['A', 'A', 'B'] });

    expect(getAxisData(indexed)).to.deep.equal(['A', 'A', 'B']);
    expect(getAxisData(unique)).to.equal(unique.data);
    expect(getAxisDataValue(indexed, 1)).to.equal('A');
    expect(getAxisDataValue(indexed, 2)).to.equal('B');
    expect(getAxisDataValue(indexed, 3)).to.equal(undefined);
    expect(getAxisDataValue(unique, 1)).to.equal('B');
    expect(getAxisDataValue(undefined, 0)).to.equal(undefined);
  });

  it('formats the original value', () => {
    const data = [1000, 1000, 2];
    const calls: any[] = [];
    const withFormatter = indexAxis({
      scaleType: 'band',
      data,
      valueFormatter: (value: number, context: any) => {
        calls.push([value, context.defaultTickLabel]);
        return `${value}ms`;
      },
    });
    const withoutFormatter = indexAxis({ scaleType: 'band', data });

    expect(withFormatter.valueFormatter?.(2, tickContext)).to.equal('2ms');
    expect(calls).to.deep.equal([[2, '2']]);
    expect(withoutFormatter.valueFormatter?.(1, tickContext)).to.equal('1000');
    expect(withoutFormatter.valueFormatter?.(1, { location: 'tooltip' })).to.equal(
      (1000).toLocaleString(),
    );
  });

  it('gives the original value to `tickInterval`, `tickLabelInterval` and `groups`', () => {
    const indexed = indexAxis({
      scaleType: 'band',
      data: ['A', 'A', 'B', 'A'],
      tickInterval: (value: string, index: number) => value === 'A' && index > 0,
      tickLabelInterval: (value: string) => value === 'B',
      groups: [{ getValue: (value: string, dataIndex: number) => `${value}${dataIndex}` }],
    });

    const tickInterval = indexed.tickInterval as (value: any, index: number) => boolean;
    const tickLabelInterval = indexed.tickLabelInterval as (value: any, index: number) => boolean;

    expect([0, 1, 2, 3].filter(tickInterval)).to.deep.equal([1, 3]);
    expect([0, 1, 2, 3].filter(tickLabelInterval)).to.deep.equal([2]);
    expect(indexed.groups?.[0].getValue(2, 5)).to.equal('B5');
  });

  it('maps a `tickInterval` array to the first index of each value', () => {
    const indexed = indexAxis({
      scaleType: 'band',
      data: ['A', 'A', 'B', 'A'],
      tickInterval: ['B', 'A', 'C'],
    });

    expect(indexed.tickInterval).to.deep.equal([2, 0]);
  });

  it('does not index the color map values formatted for a legend', () => {
    const indexed = indexAxis({
      scaleType: 'band',
      data: [10, 10, 50],
      valueFormatter: (value: number) => `${value}ms`,
    });

    expect(indexed.valueFormatter?.(40, { location: 'legend' })).to.equal('40ms');
  });
});
