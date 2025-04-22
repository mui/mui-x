import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import * as React from 'react';

const dataLength = 800;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));
const series2Data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

export default function ZoomBrush() {
  return (
    <ScatterChartPro
      xAxis={[
        {
          id: 'x',
          data: xData,
          zoom: {
            filterMode: 'discard',
            minSpan: 10,
            panning: true,
            overview: { enabled: true },
          },
          valueFormatter: (v: number) => v.toLocaleString('en-US'),
        },
        {
          id: 'x2',
          data: series2Data.map((d) => d.x),
          position: 'top',
          zoom: {
            overview: { enabled: true },
          },
        },
      ]}
      yAxis={[
        { zoom: { overview: { enabled: true } } },
        { id: 'y2', position: 'right', zoom: { overview: { enabled: true } } },
      ]}
      series={[{ data }, { data: series2Data, xAxisId: 'x2', yAxisId: 'y2' }]}
      height={400}
      margin={{ bottom: 40 }}
    />
  );
}
