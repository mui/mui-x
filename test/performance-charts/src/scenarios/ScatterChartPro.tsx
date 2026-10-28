import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { defineScenario } from '../utils/scenario';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  // Ensure the narrow x/y zoom benchmarks have a visible point.
  y: i === dataLength / 2 ? 50.025 : 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

export const scatterChartPro = defineScenario(
  'ScatterChartPro with big data amount (single renderer)',
  () => (
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
      skipAnimation
    />
  ),
);

export const scatterChartProZoomedIn = defineScenario(
  'ScatterChartPro with big data amount and zoomed in (single renderer)',
  () => (
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
      skipAnimation
    />
  ),
);

export const scatterChartProBatch = defineScenario(
  'ScatterChartPro with big data amount (batch renderer)',
  () => (
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
      skipAnimation
    />
  ),
);

export const scatterChartProBatchZoomedIn = defineScenario(
  'ScatterChartPro with big data amount and zoomed in (batch renderer)',
  () => (
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
      skipAnimation
    />
  ),
);
