import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { type ScatterSeriesType } from '@mui/x-charts/models';
import { useScatterWebGLPlotData } from './useScatterWebGLPlotData';

const baseSeries: ScatterSeriesType[] = [
  {
    type: 'scatter',
    id: 'a',
    color: '#ff0000',
    data: [
      { id: 1, x: 1, y: 1 },
      { id: 2, x: 2, y: 2 },
    ],
  },
  {
    type: 'scatter',
    id: 'b',
    color: '#00ff00',
    data: [
      { id: 3, x: 3, y: 3 },
      { id: 4, x: 4, y: 4 },
    ],
  },
];

function createWrapper(series: ScatterSeriesType[], extraKey: number = 0) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ScatterChart
        key={extraKey}
        series={series}
        width={200}
        height={200}
        xAxis={[{ min: 0, max: 5 }]}
        yAxis={[{ min: 0, max: 5 }]}
      >
        {children as React.ReactElement}
      </ScatterChart>
    );
  };
}

describe('useScatterWebGLPlotData', () => {
  it('includes every visible point', () => {
    const { result } = renderHook(() => useScatterWebGLPlotData(), {
      wrapper: createWrapper(baseSeries),
    });
    expect(result.current.pointCount).to.equal(4);
  });

  it('skips data points that fall outside the axis scale', () => {
    const series: ScatterSeriesType[] = [
      {
        type: 'scatter',
        id: 'a',
        color: '#ff0000',
        data: [
          { id: 1, x: 1, y: 1 },
          { id: 2, x: 2, y: 2 },
          { id: 3, x: Number.NaN, y: Number.NaN },
        ],
      },
    ];
    const { result } = renderHook(() => useScatterWebGLPlotData(), {
      wrapper: createWrapper(series),
    });
    expect(result.current.pointCount).to.equal(2);
  });

  it('reuses sizes and colors Float32Arrays when the series identity is stable', () => {
    const { result, rerender } = renderHook(() => useScatterWebGLPlotData(), {
      wrapper: createWrapper(baseSeries),
    });

    const firstSizes = result.current.sizes;
    const firstColors = result.current.colors;

    rerender();

    expect(result.current.sizes).to.equal(firstSizes);
    expect(result.current.colors).to.equal(firstColors);
  });
});
