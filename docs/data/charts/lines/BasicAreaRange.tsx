import * as React from 'react';
import { AreaChart } from '@mui/x-charts/AreaChart';

export default function BasicArea() {
  return (
    <AreaChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [
            { start: 2, end: 5 },
            { start: 5.5, end: 2 },
            { start: 2, end: 8.5 },
            { start: 8.5, end: 1.5 },
            { start: 1.5, end: 5 },
          ],
        },
      ]}
      height={300}
    />
  );
}
