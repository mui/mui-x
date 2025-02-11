import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { usePieSeries } from './usePieSeries';
import { PieSeriesType } from '../models';
import { PieChart } from '../PieChart';

describe('usePieSeries', () => {
  const mockSeries: PieSeriesType[] = [
    {
      type: 'pie',
      id: '1',
      data: [{ value: 1 }],
    },
    {
      type: 'pie',
      id: '2',
      data: [{ value: 1 }],
    },
  ];

  const defaultProps = {
    series: mockSeries,
    height: 400,
    width: 400,
  };

  const options: any = {
    wrapper: ({ children }: { children: React.ReactElement }) => {
      return <PieChart {...defaultProps}>{children}</PieChart>;
    },
  };

  it('should return all pie series when no seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });

  it('should return the specific pie series when a single seriesId is provided', () => {
    const { result } = renderHook(() => usePieSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return the specific pie series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries(['1', '3']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, undefined]);
  });
});
