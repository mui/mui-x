import { renderHook } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import type { SeriesId, ProcessedSeries } from '@mui/x-charts/internals';
import * as series from '@mui/x-charts/hooks/useSeries';
import { useHeatmapSeries } from './useHeatmapSeries';

describe('useHeatmapSeries', () => {
  const defaultProps = {
    valueFormatter: (v: any) => v,
    color: 'red',
    layout: 'vertical',
    type: 'heatmap',
  } as const;

  const mockSeries: ProcessedSeries = {
    heatmap: {
      series: {
        '1': {
          ...defaultProps,
          id: '1',
          data: [
            [0, 0, 10],
            [0, 1, 20],
            [0, 2, 40],
          ],
        },
        '2': {
          ...defaultProps,
          id: '2',
          data: [
            [3, 2, 20],
            [3, 3, 70],
            [3, 4, 90],
          ],
        },
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

  it('should return all heatmap series when no seriesIds are provided', () => {
    const { result } = renderHook(() => useHeatmapSeries());
    expect(result.current).to.deep.equal(mockSeries.heatmap);
  });

  it('should return the specific heatmap series when a single seriesId is provided', () => {
    const { result } = renderHook(() => useHeatmapSeries('1' as SeriesId));
    expect(result.current).to.deep.equal(mockSeries!.heatmap!.series['1']);
  });

  it('should return the specific heatmap series when multiple seriesIds are provided', () => {
    const { result } = renderHook(() => useHeatmapSeries('1' as SeriesId, '2' as SeriesId));
    expect(result.current).to.deep.equal([
      mockSeries!.heatmap!.series['1'],
      mockSeries!.heatmap!.series['2'],
    ]);
  });

  it('should filter out undefined series when invalid seriesIds are provided', () => {
    const { result } = renderHook(() => useHeatmapSeries('1' as SeriesId, '3' as SeriesId));
    expect(result.current).to.deep.equal([mockSeries!.heatmap!.series['1']]);
  });
});
