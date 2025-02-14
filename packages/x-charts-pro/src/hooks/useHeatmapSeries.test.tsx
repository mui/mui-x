import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useHeatmapSeries, useHeatmapSeriesContext } from './useHeatmapSeries';
import { Heatmap } from '../Heatmap';
import { HeatmapSeriesType } from '../models';

const mockSeries: HeatmapSeriesType[] = [
  {
    type: 'heatmap',
    id: '1',
    data: [
      [0, 0, 10],
      [0, 1, 20],
      [0, 2, 40],
    ],
  },
  {
    type: 'heatmap',
    id: '2',
    data: [
      [3, 2, 20],
      [3, 3, 70],
      [3, 4, 90],
    ],
  },
];

const defaultProps = {
  series: mockSeries,
  height: 400,
  width: 400,
  xAxis: [{ data: [1, 2, 3, 4] }],
  yAxis: [{ data: ['A', 'B', 'C', 'D', 'E'] }],
};

const options: any = {
  wrapper: ({ children }: { children: React.ReactElement }) => {
    return <Heatmap {...defaultProps}>{children}</Heatmap>;
  },
};

describe('useHeatmapSeriesContext', () => {
  it('should return all heatmap series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useHeatmapSeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1', '2']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1', '2']);
  });
});

// eslint-disable-next-line mocha/max-top-level-suites
describe('useHeatmapSeries', () => {
  it('should return the specific heatmap series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useHeatmapSeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries[0].id);
  });

  it('should return all heatmap series when no seriesId is provided', () => {
    const { result } = renderHook(() => useHeatmapSeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id, mockSeries[1].id]);
  });

  it('should return the specific heatmap series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useHeatmapSeries(['2', '1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[1].id, mockSeries[0].id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X: The following ids provided to "useHeatmapSeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "heatmap" series type.`,
    ].join('\n');

    expect(() => renderHook(() => useHeatmapSeries(['1', '3']), options)).toWarnDev(message);

    const { result } = renderHook(() => useHeatmapSeries(['1', '3']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries[0].id]);
  });
});
