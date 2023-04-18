import * as React from 'react';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = Array.from({ length: 200 }, (index: number) => ({
  id: index,
  x: -25 + Math.floor(Math.random() * 50),
  y: -25 + Math.floor(Math.random() * 50),
}));

export default function ModifyAxisPosition() {
  return (
    <ScatterChart
      series={[
        {
          type: 'scatter',
          id: 'linear',
          data,
        },
      ]}
      leftAxis={null}
      bottomAxis={null}
      topAxis={DEFAULT_X_AXIS_KEY}
      rightAxis={DEFAULT_Y_AXIS_KEY}
      width={600}
      height={500}
    />
  );
}
