import { scaleBand } from '@mui/x-charts-vendor/d3-scale';
import { describe, it, expect } from 'vitest';
import { getItemAtAxisPosition } from './getItemAtAxisPosition';

const xAxis = {
  axisIds: ['x'],
  axis: {
    x: {
      id: 'x',
      data: ['A', 'B', 'C'],
      // Three bands of 30px, from 0 to 90.
      scale: scaleBand(['A', 'B', 'C'], [0, 90]),
    },
  },
} as any;

const processedSeries = {
  bar: {
    seriesOrder: ['first', 'second'],
    series: {
      first: { id: 'first', type: 'bar', data: [1, 2, 3] },
      second: { id: 'second', type: 'bar', data: [4, 5, 6] },
    },
  },
} as any;

const resolve = (x: number, focusedItem: any = null) =>
  getItemAtAxisPosition({
    point: { x, y: 0 },
    xAxis,
    yAxis: undefined,
    processedSeries,
    focusedItem,
  });

describe('getItemAtAxisPosition', () => {
  it('resolves the data index from the x axis, using the first series', () => {
    expect(resolve(45)).to.deep.equal({ type: 'bar', seriesId: 'first', dataIndex: 1 });
  });

  it('keeps the focused series', () => {
    const focusedItem = { type: 'bar', seriesId: 'second', dataIndex: 0 };
    expect(resolve(75, focusedItem)).to.deep.equal({
      type: 'bar',
      seriesId: 'second',
      dataIndex: 2,
    });
  });

  it('falls back to the first series when the focused one is not cartesian', () => {
    const focusedItem = { type: 'pie', seriesId: 'pie', dataIndex: 0 };
    expect(resolve(15, focusedItem)).to.deep.equal({
      type: 'bar',
      seriesId: 'first',
      dataIndex: 0,
    });
  });

  it('reads the index off the axis the target series is bound to', () => {
    // Two x axes with different band counts over the same range.
    const multiAxis = {
      axisIds: ['default', 'secondary'],
      axis: {
        default: {
          id: 'default',
          data: ['A', 'B', 'C'],
          scale: scaleBand(['A', 'B', 'C'], [0, 90]),
        },
        secondary: {
          id: 'secondary',
          data: ['A', 'B', 'C', 'D', 'E', 'F'],
          scale: scaleBand(['A', 'B', 'C', 'D', 'E', 'F'], [0, 90]),
        },
      },
    } as any;

    const series = {
      bar: {
        seriesOrder: ['onSecondary'],
        series: {
          onSecondary: {
            id: 'onSecondary',
            type: 'bar',
            xAxisId: 'secondary',
            data: [1, 2, 3, 4, 5, 6],
          },
        },
      },
    } as any;

    // x=45 is band 1 of 3 on the default axis, but band 3 of 6 on the secondary one.
    expect(
      getItemAtAxisPosition({
        point: { x: 45, y: 0 },
        xAxis: multiAxis,
        yAxis: undefined,
        processedSeries: series,
        focusedItem: null,
      }),
    ).to.deep.equal({ type: 'bar', seriesId: 'onSecondary', dataIndex: 3 });
  });

  it('returns null outside of the axis', () => {
    expect(resolve(500)).to.equal(null);
  });

  it('returns null without a cartesian axis', () => {
    expect(
      getItemAtAxisPosition({
        point: { x: 45, y: 0 },
        xAxis: undefined,
        yAxis: undefined,
        processedSeries,
        focusedItem: null,
      }),
    ).to.equal(null);
  });

  it('clamps to the last item of a series shorter than the axis', () => {
    const shortSeries = {
      bar: {
        seriesOrder: ['short'],
        series: { short: { id: 'short', type: 'bar', data: [1, 2] } },
      },
    } as any;

    expect(
      getItemAtAxisPosition({
        point: { x: 75, y: 0 },
        xAxis,
        yAxis: undefined,
        processedSeries: shortSeries,
        focusedItem: null,
      }),
    ).to.deep.equal({ type: 'bar', seriesId: 'short', dataIndex: 1 });
  });
});
