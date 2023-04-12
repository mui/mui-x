import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TestLinesTime() {
  return (
    <LineChart
      xAxis={[
        {
          id: 'lineCategories',
          data: [
            new Date(2012, 2, 1),
            new Date(2012, 2, 2),
            new Date(2012, 2, 5),
            new Date(2012, 2, 10),
            new Date(2012, 2, 15),
          ],
          scaleName: 'time',
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
