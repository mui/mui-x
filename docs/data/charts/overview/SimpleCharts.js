import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SimpleCharts() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: ['bar A', 'bar B', 'bar C'],
          scaleName: 'band',
        },
      ]}
      series={[
        {
          type: 'bar',
          id: 'bar-id-1',
          xAxisKey: 'barCategories',
          data: [2, 5, 3],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
