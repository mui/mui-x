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
          scaleType: 'time',
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
          id: 's1',
          stack: '1',
          area: true,
          data: [2, 5, 3, 4, 1],
        },
        {
          id: 's2',
          data: [10, 3, 1, 2, 10],
        },
        {
          id: 's3',
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
