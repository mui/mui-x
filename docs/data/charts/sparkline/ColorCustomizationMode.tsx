import * as React from 'react';
import Stack from '@mui/material/Stack';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  height: 100,
  yAxis: { min: 0, max: 100 },
} as const;

const values = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];

export default function ColorCustomizationMode() {
  return (
    <Stack sx={{ width: '100%' }}>
      <SparkLineChart
        data={values}
        color={(mode) => (mode === 'light' ? 'black' : 'white')}
        {...settings}
      />
    </Stack>
  );
}
