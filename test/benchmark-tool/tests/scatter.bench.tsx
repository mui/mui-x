import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { benchmark } from '../utils/benchmark';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

benchmark(
  'scatter render',
  <ScatterChart
    xAxis={[{ data: xData, valueFormatter: (v: number) => v.toLocaleString('en-US') }]}
    series={[{ data }]}
    width={500}
    height={300}
  />,
);
