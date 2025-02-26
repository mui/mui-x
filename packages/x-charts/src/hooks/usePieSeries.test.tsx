import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { usePieSeries, usePieSeriesContext } from './usePieSeries';
import { PieSeriesType } from '../models';
import { PieChart } from '../PieChart';

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

describe('usePieSeriesContext', () => {
  it('should return all pie series when no seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });
});

// eslint-disable-next-line mocha/max-top-level-suites
describe('usePieSeries', () => {
  it('should return the specific pie series when a single seriesId is provided', () => {
    const { result } = renderHook(() => usePieSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return all pie series when no seriesId is provided', () => {
    const { result } = renderHook(() => usePieSeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
  });

  it('should return the specific pie series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => usePieSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X: The following ids provided to "usePieSeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "pie" series type.`,
    ].join('\n');

    expect(() => renderHook(() => usePieSeries(['1', '3']), options)).toWarnDev(message);

    const { result } = renderHook(() => usePieSeries(['1', '3']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id]);
  });
});
