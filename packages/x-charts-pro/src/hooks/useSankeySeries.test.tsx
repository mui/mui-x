import { renderHook, type RenderHookResult } from '@mui/internal-test-utils';
import * as React from 'react';
import { useSankeySeries, useSankeySeriesContext } from './useSankeySeries';
import { Unstable_SankeyChart as SankeyChart, type SankeySeriesType } from '../SankeyChart';
import type { DefaultizedSankeySeriesType } from '../SankeyChart/sankey.types';

const mockSeries: SankeySeriesType = {
  type: 'sankey',
  id: '1',
  data: {
    nodes: [
      { id: 'A', label: 'Node A' },
      { id: 'B', label: 'Node B' },
      { id: 'C', label: 'Node C' },
    ],
    links: [
      { source: 'A', target: 'B', value: 5 },
      { source: 'A', target: 'C', value: 3 },
      { source: 'B', target: 'C', value: 2 },
    ],
  },
};

const defaultProps = {
  series: mockSeries,
  height: 400,
  width: 400,
};

const options: any = {
  wrapper: ({ children }: { children: React.ReactElement }) => {
    return <SankeyChart {...defaultProps}>{children}</SankeyChart>;
  },
};

describe('useSankeySeriesContext', () => {
  it('should return all sankey series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useSankeySeriesContext(), options);
    expect(result.current?.seriesOrder).to.deep.equal(['1']);
    expect(Object.keys(result.current?.series ?? {})).to.deep.equal(['1']);
  });
});

describe('useSankeySeries', () => {
  it('should return the specific sankey series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useSankeySeries('1'), options);
    expect(result.current?.id).to.deep.equal(mockSeries.id);
  });

  it('should return all sankey series when no seriesId is provided', () => {
    const { result } = renderHook(() => useSankeySeries(), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries.id]);
  });

  it('should return the specific sankey series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useSankeySeries(['1']), options);
    expect(result.current?.map((v) => v?.id)).to.deep.equal([mockSeries.id]);
  });

  it('should return undefined series when invalid seriesIds are provided', () => {
    const message = [
      `MUI X Charts: The following ids provided to "useSankeySeries" could not be found: "3".`,
      `Make sure that they exist and their series are using the "sankey" series type.`,
    ].join('\n');

    let render: RenderHookResult<DefaultizedSankeySeriesType[], unknown> | undefined;

    expect(() => {
      render = renderHook(() => useSankeySeries(['1', '3']), options);
    }).toWarnDev(message);

    expect(render?.result.current?.map((v) => v?.id)).to.deep.equal([mockSeries.id]);
  });

  it('should return empty array when empty seriesIds array is provided', () => {
    const { result } = renderHook(() => useSankeySeries([]), options);
    expect(result.current).to.deep.equal([]);
  });
});
