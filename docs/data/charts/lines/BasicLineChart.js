import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart() {
  return (
    <LineChart
      xAxis={[{ id: 'x', data: [1, 2, 3, 4, 8, 10] }]}
      series={[
        {
          type: 'line',
          id: 'y',
          xAxisKey: 'x',
          data: [0, 5, 2, 8, 1, 1],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
