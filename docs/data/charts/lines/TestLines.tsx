import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TestLines() {
  return (
    <LineChart
      xAxis={[
        {
          id: 'lineCategories',
          data: [2, 5, 20, 23, 25],
        },
      ]}
      yAxis={[
        {
          id: 'lineCategoriesY',
          scaleType: 'linear',
        },
      ]}
      series={[
        {
          stack: '1',
          area: true,
          data: [2, 5, 3, 4, 1],
        },
        {
          data: [10, 3, 1, 2, 10],
        },
        {
          stack: '1',
          area: true,
          data: [10, 3, 1, 2, 10],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
