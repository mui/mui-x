import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import { useLineSeries } from './useLineSeries';
import * as series from './useSeries';
import { SeriesId } from '../models/seriesType/common';
import { FormattedSeries } from '../context/SeriesProvider';

describe('useLineSeries', () => {
  const defaultProps = {
    valueFormatter: (v: any) => v,
    color: 'red',
    layout: 'vertical',
    type: 'line',
    stackedData: [] as [number, number][],
  } as const;

  const mockSeries: FormattedSeries = {
    line: {
      series: {
        '1': { ...defaultProps, id: '1', data: [1, 2, 3] },
        '2': { ...defaultProps, id: '2', data: [4, 5, 6] },
      },
      seriesOrder: ['1', '2'],
      stackingGroups: [],
    },
  };

  beforeEach(() => {
    stub(series, 'useSeries').returns(mockSeries);
  });

  afterEach(() => {
    restore();
  });

  it('should return all line series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries());
    expect(result.current).to.deep.equal(mockSeries.line);
  });

  it('should return the specific line series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useLineSeries('1' as SeriesId));
    expect(result.current).to.deep.equal(mockSeries!.line!.series['1']);
  });

  it('should return the specific line series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries('1' as SeriesId, '2' as SeriesId));
    expect(result.current).to.deep.equal([
      mockSeries!.line!.series['1'],
      mockSeries!.line!.series['2'],
    ]);
  });

  it('should filter out undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries('1' as SeriesId, '3' as SeriesId));
    expect(result.current).to.deep.equal([mockSeries!.line!.series['1']]);
  });
});
