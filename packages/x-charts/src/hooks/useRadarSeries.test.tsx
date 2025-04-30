import { renderHook, RenderHookResult } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useRadarSeries, useRadarSeriesContext } from './useRadarSeries';
import { DefaultizedRadarSeriesType, RadarSeriesType } from '../models';
import { Unstable_RadarChart as RadarChart } from '../RadarChart';

const mockSeries: RadarSeriesType[] = [
  {
    type: 'radar',
    id: '1',
    data: [1, 2, 3],
  },
  {
    type: 'radar',
    id: '2',
    data: [4, 5, 6],
  },
];

const defaultProps = {
  series: mockSeries,
  radar: { metrics: ['A', 'B', 'C'] },
  height: 400,
  width: 400,
};

const options: any = {
  wrapper: ({ children }: { children: React.ReactElement }) => {
    return <RadarChart {...defaultProps}>{children}</RadarChart>;
  },
};

describe('useRadarSeriesContext', () => {
  it('should return all radar series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useRadarSeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });
});

// eslint-disable-next-line mocha/max-top-level-suites
describe('useRadarSeries', () => {
  it('should return the specific radar series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useRadarSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return all radar series when no seriesId is provided', () => {
    const { result } = renderHook(() => useRadarSeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
  });

  it('should return the specific radar series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useRadarSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X Charts: The following ids provided to "useRadarSeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "radar" series type.`,
    ].join('\n');

    let render: RenderHookResult<DefaultizedRadarSeriesType[], unknown> | undefined;

    expect(() => {
      render = renderHook(() => useRadarSeries(['1', '3']), options);
    }).toWarnDev(message);

    expect(render?.result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id]);
  });
});
