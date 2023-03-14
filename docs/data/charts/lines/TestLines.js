import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TestLines() {
  return (
    <LineChart
      xAxis={[
        {
          id: 'barCategories',
          data: [2, 5, 20, 23, 25],
          scale: 'band',
        },
      ]}
      yAxis={[
        {
          id: 'barCategoriesY',
          scale: 'linear',
        },
      ]}
      series={[
        {
          type: 'bar',
          id: 's1',
          stack: '1',
          area: { color: 'red' },
          xAxisKey: 'barCategories',
          yAxisKey: 'barCategoriesY',
          data: [2, 5, 3, 4, 1],
        },
        {
          type: 'bar',
          id: 's2',
          xAxisKey: 'barCategories',
          yAxisKey: 'barCategoriesY',
          data: [10, 3, 1, 2, 10],
        },
        {
          type: 'bar',
          id: 's3',
          xAxisKey: 'barCategories',
          yAxisKey: 'barCategoriesY',
          stack: '1',
          area: { color: 'blue' },
          data: [10, 3, 1, 2, 10],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
