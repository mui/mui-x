import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);
const yData = data.map((d) => d.y);

benchmark('LineChartPro with big data amount and zoomed in (with marks)', () => (
  <LineChartPro
    xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' }, domainLimit: 'nice' }]}
    initialZoom={[{ axisId: 'x', start: 50, end: 75 }]}
    series={[{ data: yData, showMark: true }]}
    width={500}
    height={300}
  />
));
