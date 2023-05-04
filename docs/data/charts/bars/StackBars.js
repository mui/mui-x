import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function StackBars() {
  return (
    <BarChart
      series={[
        { data: [3, 4, 1, 6, 5], stack: 'A', label: 'A.1' },
        { data: [4, 3, 1, 5, 8], stack: 'A', label: 'A.2' },
        { data: [4, 2, 5, 4, 1], stack: 'B', label: 'B.1' },
        { data: [2, 8, 1, 3, 1], stack: 'B', label: 'B.2' },
        { data: [10, 6, 5, 8, 9], label: 'C' },
      ]}
      width={600}
      height={500}
    />
  );
}
