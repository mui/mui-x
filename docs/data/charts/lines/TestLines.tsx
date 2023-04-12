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
          scaleName: 'linear',
        },
      ]}
      series={[
        {
          type: 'line',
          id: 's1',
          stack: '1',
          area: {},
          xAxisKey: 'lineCategories',
          yAxisKey: 'lineCategoriesY',
          data: [2, 5, 3, 4, 1],
        },
        {
          type: 'line',
          id: 's2',
          xAxisKey: 'lineCategories',
          yAxisKey: 'lineCategoriesY',
          data: [10, 3, 1, 2, 10],
        },
        {
          type: 'line',
          id: 's3',
          xAxisKey: 'lineCategories',
          yAxisKey: 'lineCategoriesY',
          stack: '1',
          area: {},
          data: [10, 3, 1, 2, 10],
        },
      ]}
      width={600}
      height={500}
    />
  );
}
