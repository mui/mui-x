import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';

const data = [
  { label: 'Group A', value: 400 },
  { label: 'Group B', value: 300 },
  { label: 'Group C', value: 300 },
];

export default function PieChartDemo() {
  return (
    <>
      <Typography>Downloads per package</Typography>
      <PieChart
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            data,
            innerRadius: '150%',
            outerRadius: '200%',
            cy: '100%',
          },
        ]}
        sx={{ aspectRatio: 2 }}
        height={100}
        margin={5}
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
    </>
  );
}
