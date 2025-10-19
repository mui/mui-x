import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const data = [
  { x: -6, y: 14, id: 0 },
  { x: 24, y: -16, id: 1 },
  { x: 12, y: 14, id: 2 },
  { x: 5, y: 5, id: 3 },
  { x: -18, y: -3, id: 4 },
  { x: -17, y: -21, id: 5 },
  { x: -22, y: -2, id: 6 },
  { x: 18, y: -8, id: 7 },
  { x: 5, y: -17, id: 8 },
  { x: 10, y: 7, id: 9 },
];

export default function PiecewiseRestrictedAxis() {
  return (
    <Stack maxWidth={500}>
      <ScatterChart
        xAxis={[{ min: -25, max: 23 }]}
        yAxis={[
          {
            colorMap: {
              type: 'piecewise',
              thresholds: [-20, 0],
              colors: ['red', 'blue', 'green'],
            },
          },
        ]}
        series={[{ data }]}
        height={300}
        width={500}
      >
        <ChartsReferenceLine y={-20} lineStyle={{ stroke: 'blue' }} />
        <ChartsReferenceLine y={0} lineStyle={{ stroke: 'green' }} />
      </ScatterChart>
      <Typography>
        All blue points should be above the blue line, all green points above the green line.
      </Typography>
    </Stack>
  );
}
