/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';

const data = [
  { label: 'v6', value: 43_988 },
  { label: 'v7', value: 270_393 },
  { label: 'v8', value: 67_849 },
];

export default function PieChartDemo() {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
