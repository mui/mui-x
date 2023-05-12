import * as React from 'react';
import { LineChart, markElementClasses } from '@mui/x-charts/LineChart';

const lineChartsParams = {
  xAxis: [{ data: [...Array(100)].map((v, i) => 0.1 * i) }],
  series: [
    {
      data: [...Array(100)].map((v, i) => Math.cos(0.1 * i)),
      stack: '1',
      area: true,
      label: 'cos(x)',
    },
    {
      data: [...Array(100)].map((v, i) => Math.abs(Math.sin(0.1 * i))),
      stack: '1',
      area: true,
      label: 'sin(x)',
    },
    {
      data: [...Array(100)].map((v, i) => Math.abs(Math.cos(0.1 * i))),
      stack: '1',
      area: true,
      label: '|cos(x)|',
    },
  ],
  width: 600,
  height: 400,
  sx: {
    [`& .${markElementClasses.root}`]: {
      display: 'none',
    },
  },
};
export default function Highlights() {
  return <LineChart {...lineChartsParams} tooltip={{ trigger: 'axis' }} />;
}
