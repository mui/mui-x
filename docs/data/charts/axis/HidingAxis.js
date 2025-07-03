import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function HidingAxis() {
  return (
    <BarChart
      series={[{ data: [1, 2, 3, 2, 1] }]}
      xAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
      yAxis={[{ position: 'none' }]}
      height={300}
      width={300}
    />
  );
}
