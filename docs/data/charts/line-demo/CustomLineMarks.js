import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function CustomLineMarks() {
  return (
    <LineChart
      height={300}
      series={[
        {
          data: pData,
          label: 'pv',
          shape: 'cross',
          showMark: ({ index }) => index % 2 === 0,
        },
        {
          data: uData,
          label: 'uv',
          shape: 'diamond',
          showMark: ({ index }) => index % 2 === 0,
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    />
  );
}
