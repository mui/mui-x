import { renderHook, RenderHookResult } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useBarSeries, useBarSeriesContext } from './useBarSeries';
import { BarSeriesType, DefaultizedBarSeriesType } from '../models';
import { BarChart } from '../BarChart';

const mockSeries: BarSeriesType[] = [
  {
    type: 'bar',
    id: '1',
    data: [1, 2, 3],
  },
  {
    type: 'bar',
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
    return <BarChart {...defaultProps}>{children}</BarChart>;
  },
};

describe('useBarSeriesContext', () => {
  it('should return all bar series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useBarSeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });
});

// eslint-disable-next-line mocha/max-top-level-suites
describe('useBarSeries', () => {
  it('should return the specific bar series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useBarSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return all bar series when no seriesId is provided', () => {
    const { result } = renderHook(() => useBarSeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
  });

  it('should return the specific bar series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useBarSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X: The following ids provided to "useBarSeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "bar" series type.`,
    ].join('\n');

    let render: RenderHookResult<DefaultizedBarSeriesType[], unknown> | undefined;

    expect(() => {
      render = renderHook(() => useBarSeries(['1', '3']), options);
    }).toWarnDev(message);

    expect(render?.result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id]);
  });
});
