import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

const dataLength = 800;
const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);
const yData = data.map((d) => d.y);

benchmark('BarChartPro with big data amount', () => (
  <BarChartPro
    xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }]}
    initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
    series={[{ data: yData }]}
    width={500}
    height={300}
  />
));
