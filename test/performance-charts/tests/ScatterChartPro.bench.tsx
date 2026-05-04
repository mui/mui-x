import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

benchmark('ScatterChartPro with big data amount (single renderer)', () => (
  <ScatterChartPro
    xAxis={[
      {
        id: 'x',
        data: xData,
        zoom: { filterMode: 'discard' },
        valueFormatter: (v: number) => v.toLocaleString('en-US'),
      },
    ]}
    initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
    series={[{ data }]}
    width={500}
    height={300}
  />
));

benchmark('ScatterChartPro with big data amount and zoomed in (single renderer)', () => (
  <ScatterChartPro
    xAxis={[
      {
        id: 'x',
        data: xData,
        valueFormatter: (v: number) => v.toLocaleString('en-US'),
        zoom: { minSpan: 0 },
      },
    ]}
    yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
    series={[{ data }]}
    width={500}
    height={300}
    initialZoom={[
      { axisId: 'x', start: 50, end: 50.1 },
      { axisId: 'y', start: 50, end: 50.1 },
    ]}
  />
));

benchmark('ScatterChartPro with big data amount (batch renderer)', () => (
  <ScatterChartPro
    xAxis={[
      {
        id: 'x',
        data: xData,
        zoom: { filterMode: 'discard' },
        valueFormatter: (v: number) => v.toLocaleString('en-US'),
      },
    ]}
    initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
    series={[{ data }]}
    width={500}
    height={300}
    renderer="svg-batch"
  />
));

benchmark('ScatterChartPro with big data amount and zoomed in (batch renderer)', () => (
  <ScatterChartPro
    xAxis={[
      {
        id: 'x',
        data: xData,
        valueFormatter: (v: number) => v.toLocaleString('en-US'),
        zoom: { minSpan: 0 },
      },
    ]}
    yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
    series={[{ data }]}
    width={500}
    height={300}
    initialZoom={[
      { axisId: 'x', start: 50, end: 50.1 },
      { axisId: 'y', start: 50, end: 50.1 },
    ]}
    renderer="svg-batch"
  />
));
