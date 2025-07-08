import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SymlogArea() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15] }]}
      yAxis={[{ scaleType: 'symlog', width: 56 }]}
      series={[
        {
          data: [10, 1_000, 5_000, 10_000, -50_000, 20_000, 100_000, -500],
          area: true,
        },
      ]}
      height={600}
    />
  );
}
