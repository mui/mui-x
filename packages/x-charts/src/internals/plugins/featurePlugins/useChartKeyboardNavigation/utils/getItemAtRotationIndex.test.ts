import { getItemAtRotationIndex } from './getItemAtRotationIndex';

const processedSeries = {
  radar: {
    seriesOrder: ['first', 'second'],
    series: {
      first: { id: 'first', type: 'radar', data: [1, 2, 3] },
      second: { id: 'second', type: 'radar', data: [4, 5, 6] },
    },
  },
} as any;

const resolve = (dataIndex: number | null, focusedItem: any = null) =>
  getItemAtRotationIndex({ dataIndex, processedSeries, focusedItem });

describe('getItemAtRotationIndex', () => {
  it('resolves the index against the first series', () => {
    expect(resolve(2)).to.deep.equal({ type: 'radar', seriesId: 'first', dataIndex: 2 });
  });

  it('keeps the focused series, so the click moves along the one being navigated', () => {
    const focused = { type: 'radar', seriesId: 'second', dataIndex: 0 };

    expect(resolve(1, focused)).to.deep.equal({
      type: 'radar',
      seriesId: 'second',
      dataIndex: 1,
    });
  });

  it('falls back to the first series when the focused one is of another type', () => {
    const focused = { type: 'bar', seriesId: 'elsewhere', dataIndex: 0 };

    expect(resolve(1, focused)).to.deep.equal({
      type: 'radar',
      seriesId: 'first',
      dataIndex: 1,
    });
  });

  it('resolves nothing when the axis reports no index', () => {
    expect(resolve(null)).to.equal(null);
    // -1 is what `getRotationAxisIndex` returns outside the rotation range.
    expect(resolve(-1)).to.equal(null);
  });

  it('resolves nothing without a series to attach the index to', () => {
    expect(
      getItemAtRotationIndex({ dataIndex: 1, processedSeries: {} as any, focusedItem: null }),
    ).to.equal(null);
  });

  it('clamps an index the series is too short for', () => {
    expect(resolve(9)).to.deep.equal({ type: 'radar', seriesId: 'first', dataIndex: 2 });
  });
});
