import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const seriesA = {
  data: [2, 3, 1, 4, 5],
  label: 'series A',
};
const seriesB = {
  data: [3, 1, 4, 2, 1],
  label: 'series B',
};
const seriesC = {
  data: [3, 2, 4, 5, 1],
  label: 'series C',
};
export default function BasicStacking() {
  return (
    <BarChart
      width={600}
      height={300}
      series={[
        { ...seriesA, stack: 'total' },
        { ...seriesB, stack: 'total' },
        { ...seriesC, stack: 'total' },
      ]}
    />
  );
}
