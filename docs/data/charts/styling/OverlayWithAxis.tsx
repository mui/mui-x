import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const emptySeries = {
  series: [],
  margin: { top: 10, right: 10, left: 25, bottom: 25 },
  height: 150,
};

export default function OverlayWithAxis() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <LineChart
        loading
        xAxis={[{ data: [0, 1, 2, 4, 5] }]}
        yAxis={[{ min: 0, max: 10 }]}
        {...emptySeries}
      />
      <LineChart
        yAxis={[{ min: -5, max: 5 }]}
        xAxis={[
          {
            scaleType: 'time',
            data: [
              new Date(2019, 0, 1),
              new Date(2020, 0, 1),
              new Date(2021, 0, 1),
              new Date(2022, 0, 1),
            ],
            tickNumber: 3,
          },
        ]}
        {...emptySeries}
      />
    </Stack>
  );
}
