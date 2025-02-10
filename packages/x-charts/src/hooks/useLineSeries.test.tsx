import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useLineSeries } from './useLineSeries';
import { LineSeriesType } from '../models';
import { LineChart } from '../LineChart';

describe('useLineSeries', () => {
  const mockSeries: LineSeriesType[] = [
    {
      type: 'line',
      id: '1',
      data: [1, 2, 3],
    },
    {
      type: 'line',
      id: '2',
      data: [4, 5, 6],
    },
  ];

  const defaultProps = {
    series: mockSeries,
    height: 400,
    width: 400,
  };

  const options: any = {
    wrapper: ({ children }: { children: React.ReactElement }) => {
      return <LineChart {...defaultProps}>{children}</LineChart>;
    },
  };

  it('should return all line series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });

  it('should return the specific line series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useLineSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return the specific line series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries('2', '1'), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => useLineSeries('1', '3'), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, undefined]);
  });
});
