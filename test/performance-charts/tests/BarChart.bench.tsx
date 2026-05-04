import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { BarChart } from '@mui/x-charts/BarChart';

const dataLength = 800;
const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);
const yData = data.map((d) => d.y);

benchmark('BarChart with big data amount', () => (
  <BarChart xAxis={[{ data: xData }]} series={[{ data: yData }]} width={500} height={300} />
));
