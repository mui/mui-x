import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { AreaPlot } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function TinyAreaChart() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[
        {
          data: uData,
          type: 'line',
          label: 'uv',
          area: true,
          stack: 'total',
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    >
      <AreaPlot />
    </ChartContainer>
  );
}
