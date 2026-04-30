import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { LineChart } from '@mui/x-charts/LineChart';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);
const yData = data.map((d) => d.y);

benchmark('LineChart with big data amount (with marks)', () => (
  <LineChart
    xAxis={[{ data: xData, domainLimit: 'nice' }]}
    series={[{ data: yData, showMark: true }]}
    width={500}
    height={300}
  />
));

benchmark('Area chart with big data amount (no marks)', () => (
  <LineChart
    xAxis={[{ data: xData, domainLimit: 'nice' }]}
    series={[{ area: true, data: yData, showMark: false }]}
    width={500}
    height={300}
  />
));
