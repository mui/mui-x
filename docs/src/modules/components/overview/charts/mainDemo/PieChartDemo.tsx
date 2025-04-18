import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { label: 'Group A', value: 400 },
  { label: 'Group B', value: 300 },
  { label: 'Group C', value: 300 },
];

export default function PieChartDemo() {
  return (
    <PieChart
      series={[
        {
          startAngle: -90,
          endAngle: 90,
          data,
          innerRadius: 70,
        },
      ]}
      height={200}
      slotProps={{
        legend: {
          direction: 'horizontal',
          position: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        },
      }}
    />
  );
}
