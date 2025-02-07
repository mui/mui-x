import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import { useScatterSeries } from './useScatterSeries';
import * as series from './useSeries';
import { SeriesId } from '../models/seriesType/common';
import { FormattedSeries } from '../context/SeriesProvider';

describe('useScatterSeries', () => {
  const defaultProps = {
    valueFormatter: (v: any) => v,
    color: 'red',
    layout: 'vertical',
    type: 'scatter',
  } as const;

  const mockSeries: FormattedSeries = {
    scatter: {
      series: {
        '1': {
          ...defaultProps,
          id: '1',
          data: [
            { id: 1, x: 1, y: 1 },
            { id: 2, x: 2, y: 2 },
          ],
        },
        '2': {
          ...defaultProps,
          id: '2',
          data: [
            { id: 3, x: 3, y: 3 },
            { id: 4, x: 4, y: 4 },
          ],
        },
      },
      seriesOrder: ['1', '2'],
    },
  };

  beforeEach(() => {
    stub(series, 'useSeries').returns(mockSeries);
  });

  afterEach(() => {
    restore();
  });

  it('should return all scatter series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useScatterSeries());
    expect(result.current).to.deep.equal(mockSeries.scatter);
  });

  it('should return the specific scatter series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useScatterSeries('1' as SeriesId));
    expect(result.current).to.deep.equal(mockSeries!.scatter!.series['1']);
  });

  it('should return the specific scatter series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useScatterSeries('1' as SeriesId, '2' as SeriesId));
    expect(result.current).to.deep.equal([
      mockSeries!.scatter!.series['1'],
      mockSeries!.scatter!.series['2'],
    ]);
  });

  it('should filter out undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => useScatterSeries('1' as SeriesId, '3' as SeriesId));
    expect(result.current).to.deep.equal([mockSeries!.scatter!.series['1']]);
  });
});
