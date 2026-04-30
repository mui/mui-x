import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { PieChart } from '@mui/x-charts/PieChart';

const dataLength = 50;
const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
  value: 50 + Math.sin(i / 5) * 1000,
}));

benchmark('PieChart with big data amount', () => (
  <PieChart
    series={[
      {
        data,
        arcLabel: (v) => v.value.toFixed(0),
      },
    ]}
    width={500}
    height={300}
  />
));
