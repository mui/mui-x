import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];
const uData = [4000, -3000, -2000, 2780, -1890, 2390, 3490];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BarChartStackedBySign() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId', stack: 'stack1' },
        { data: uData, label: 'uv', id: 'uvId', stack: 'stack1' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
}
