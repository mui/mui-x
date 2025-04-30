import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SimpleCharts() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: ['bar A', 'bar B', 'bar C'],
        },
      ]}
      series={[
        {
          data: [2, 5, 3],
        },
      ]}
      height={300}
    />
  );
}
