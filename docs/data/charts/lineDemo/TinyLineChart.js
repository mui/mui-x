import * as React from 'react';
import { ChartContainer, LinePlot } from '@mui/x-charts';

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

export default function TinyLineChart() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[{ type: 'line', data: pData }]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      sx={{
        '.MuiLineElement-root': {
          stroke: '#8884d8',
          strokeWidth: 2,
        },
        '.MuiMarkElement-root': {
          stroke: '#8884d8',
          fill: '#fff',
          strokeWidth: 2,
        },
      }}
      disableAxisListener
    >
      <LinePlot />
    </ChartContainer>
  );
}
