import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import * as React from 'react';

const dataLength = 801;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));
const series2Data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 10) * 25,
}));

const xData = data.map((d) => d.x);

export default function ZoomSliderPreview() {
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
            slider: { enabled: true },
          },
          valueFormatter: (v: number) => v.toLocaleString('en-US'),
        },
        {
          id: 'x2',
          data: series2Data.map((d) => d.x),
          position: 'top',
          zoom: {
            slider: { enabled: true },
          },
        },
      ]}
      yAxis={[
        { id: 'y', width: 28, zoom: { slider: { enabled: true } } },
        {
          id: 'y2',
          position: 'right',
          width: 28,
          zoom: { slider: { enabled: true } },
        },
      ]}
      series={[{ data }, { data: series2Data, xAxisId: 'x2', yAxisId: 'y2' }]}
      height={400}
      margin={{ bottom: 40 }}
      initialZoom={[
        { axisId: 'x', start: 45, end: 55 },
        { axisId: 'x2', start: 30, end: 70 },
        { axisId: 'y', start: 40, end: 60 },
        { axisId: 'y2', start: 30, end: 70 },
      ]}
    />
  );
}
