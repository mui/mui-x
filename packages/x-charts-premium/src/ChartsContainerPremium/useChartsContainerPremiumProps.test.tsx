import * as React from 'react';
import { createRenderer, act } from '@mui/internal-test-utils';
import { useStore } from '@mui/x-charts/internals';
import type { ZoomData } from '@mui/x-charts/internals';
import type { UseChartProZoomSignature } from '@mui/x-charts-pro/plugins';
import { describe, it, expect, vi } from 'vitest';
import { ScatterChartPremium } from '../ScatterChartPremium';
import { CandlestickChart } from '../CandlestickChart';
import type { ChartPremiumApi } from '../context';

const scatterProps = {
  series: [
    {
      data: [
        { x: 1, y: 1, id: 0 },
        { x: 2, y: 2, id: 1 },
        { x: 3, y: 3, id: 2 },
      ],
    },
  ],
  xAxis: [{ id: 'x', zoom: true }],
  width: 200,
  height: 200,
  slotProps: { tooltip: { trigger: 'none' } },
} as const;

const candlestickProps = {
  series: [
    {
      data: [
        [100, 110, 90, 105],
        [105, 115, 95, 110],
        [110, 120, 100, 108],
      ] as [number, number, number, number][],
    },
  ],
  xAxis: [{ id: 'x', data: ['A', 'B', 'C'], zoom: true }],
  width: 200,
  height: 200,
  slotProps: { tooltip: { trigger: 'none' } },
} as const;

function ZoomSpy({ onZoomData }: { onZoomData: (zoomData: ZoomData | undefined) => void }) {
  const store = useStore<[UseChartProZoomSignature]>();
  const zoomData = store.use((state) => state.zoom.zoomData.find((data) => data.axisId === 'x'));

  React.useEffect(() => {
    onZoomData(zoomData);
  }, [onZoomData, zoomData]);

  return null;
}

// The zoom props and `apiRef` are handled by `useChartsContainerProProps`, so the Premium
// hook must forward them to it instead of stripping them from its input.
describe('useChartsContainerPremiumProps', () => {
  const { render } = createRenderer();

  it('should forward `apiRef` and `onZoomChange` on ScatterChartPremium', async () => {
    const apiRef: React.RefObject<ChartPremiumApi<'scatter'> | undefined> = { current: undefined };
    const onZoomChange = vi.fn();

    render(<ScatterChartPremium {...scatterProps} apiRef={apiRef} onZoomChange={onZoomChange} />);

    expect(apiRef.current).toBeDefined();

    await act(async () => {
      apiRef.current!.setZoomData([{ axisId: 'x', start: 25, end: 75 }]);
    });

    expect(onZoomChange).toHaveBeenLastCalledWith([{ axisId: 'x', start: 25, end: 75 }]);
  });

  it('should forward `initialZoom` on ScatterChartPremium', () => {
    const onZoomData = vi.fn();

    render(
      <ScatterChartPremium {...scatterProps} initialZoom={[{ axisId: 'x', start: 10, end: 40 }]}>
        <ZoomSpy onZoomData={onZoomData} />
      </ScatterChartPremium>,
    );

    expect(onZoomData).toHaveBeenLastCalledWith({ axisId: 'x', start: 10, end: 40 });
  });

  it('should forward `zoomData` on ScatterChartPremium', () => {
    const onZoomData = vi.fn();

    render(
      <ScatterChartPremium
        {...scatterProps}
        zoomData={[{ axisId: 'x', start: 10, end: 40 }]}
        onZoomChange={() => {}}
      >
        <ZoomSpy onZoomData={onZoomData} />
      </ScatterChartPremium>,
    );

    expect(onZoomData).toHaveBeenLastCalledWith({ axisId: 'x', start: 10, end: 40 });
  });

  it('should forward `apiRef` and `onZoomChange` on CandlestickChart', async () => {
    const apiRef: React.RefObject<ChartPremiumApi | undefined> = { current: undefined };
    const onZoomChange = vi.fn();

    render(<CandlestickChart {...candlestickProps} apiRef={apiRef} onZoomChange={onZoomChange} />);

    expect(apiRef.current).toBeDefined();

    await act(async () => {
      apiRef.current!.setZoomData([{ axisId: 'x', start: 25, end: 75 }]);
    });

    expect(onZoomChange).toHaveBeenLastCalledWith([{ axisId: 'x', start: 25, end: 75 }]);
  });
});
