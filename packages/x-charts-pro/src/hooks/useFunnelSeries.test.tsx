import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useFunnelSeries, useFunnelSeriesContext } from './useFunnelSeries';
import { Unstable_FunnelChart as FunnelChart, FunnelSeriesType } from '../FunnelChart';

const mockSeries: FunnelSeriesType[] = [
  {
    type: 'funnel',
    id: '1',
    data: [{ value: 100 }, { value: 200 }, { value: 300 }],
  },
  {
    type: 'funnel',
    id: '2',
    data: [{ value: 400 }, { value: 500 }, { value: 600 }],
  },
];

const defaultProps = {
  series: mockSeries,
  height: 400,
  width: 400,
};

const options: any = {
  wrapper: ({ children }: { children: React.ReactElement }) => {
    return <FunnelChart {...defaultProps}>{children}</FunnelChart>;
  },
};

describe('useFunnelSeriesContext', () => {
  it('should return all funnel series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useFunnelSeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });
});

// eslint-disable-next-line mocha/max-top-level-suites
describe('useFunnelSeries', () => {
  it('should return the specific funnel series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useFunnelSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return all funnel series when no seriesId is provided', () => {
    const { result } = renderHook(() => useFunnelSeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
  });

  it('should return the specific funnel series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useFunnelSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X: The following ids provided to "useFunnelSeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "funnel" series type.`,
    ].join('\n');

    expect(() => renderHook(() => useFunnelSeries(['1', '3']), options)).toWarnDev(message);

    const { result } = renderHook(() => useFunnelSeries(['1', '3']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id]);
  });
});
