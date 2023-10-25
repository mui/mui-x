import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function DifferentLength() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
        {
          data: [null, null, null, 2, 5.5, 2, 8.5, 1.5, 5],
        },
        {
          data: [7, 8, 5, 1, null, 0, 2, 5.5],
        },
      ]}
      height={300}
    />
  );
}
