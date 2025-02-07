import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import { usePieSeries } from './usePieSeries';
import * as series from './useSeries';
import { SeriesId } from '../models/seriesType/common';
import { FormattedSeries } from '../context/SeriesProvider';

describe('usePieSeries', () => {
  const defaultProps = {
    valueFormatter: (v: any) => v,
    color: 'red',
    layout: 'vertical',
    type: 'pie',
    stackedData: [] as [number, number][],
  } as const;

  const dataExample = {
    id: 1,
    value: 10,
    startAngle: 0,
    endAngle: 1,
    color: 'red',
    formattedValue: '10',
    index: 0,
    padAngle: 0,
  } as const;

  const mockSeries: FormattedSeries = {
    pie: {
      series: {
        '1': { ...defaultProps, id: '1', data: [dataExample] },
        '2': { ...defaultProps, id: '2', data: [dataExample] },
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

  it('should return all pie series when no seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries());
    expect(result.current).to.deep.equal(mockSeries.pie);
  });

  it('should return the specific pie series when a single seriesId is provided', () => {
    const { result } = renderHook(() => usePieSeries('1' as SeriesId));
    expect(result.current).to.deep.equal(mockSeries!.pie!.series['1']);
  });

  it('should return the specific pie series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries('1' as SeriesId, '2' as SeriesId));
    expect(result.current).to.deep.equal([
      mockSeries!.pie!.series['1'],
      mockSeries!.pie!.series['2'],
    ]);
  });

  it('should filter out undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries('1' as SeriesId, '3' as SeriesId));
    expect(result.current).to.deep.equal([mockSeries!.pie!.series['1']]);
  });
});
