import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function TestBars() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: [2, 5, 20, 23, 25],
          scaleName: 'band',
        },
      ]}
      yAxis={[
        {
          id: 'barCategoriesY',
          scaleName: 'linear',
        },
      ]}
      series={[
        {
          type: 'bar',
          id: 's1',
          stack: '1',
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
          data: [10, 3, 1, 2, 10],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
