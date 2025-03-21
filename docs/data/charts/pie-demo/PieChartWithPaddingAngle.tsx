import * as React from 'react';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { label: 'Group A', value: 400 },
  { label: 'Group B', value: 300 },
  { label: 'Group C', value: 300 },
  { label: 'Group D', value: 200 },
];

export default function PieChartWithPaddingAngle() {
  return (
    <Stack width="100%" direction="row" flexWrap="wrap">
      <PieChart
        series={[
          {
            paddingAngle: 5,
            innerRadius: 60,
            outerRadius: 80,
            data,
          },
        ]}
        width={200}
        height={200}
        hideLegend
      />
      <PieChart
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            paddingAngle: 5,
            innerRadius: 60,
            outerRadius: 80,
            cy: '75%',
            data,
          },
        ]}
        width={200}
        height={150}
        hideLegend
      />
    </Stack>
  );
}
