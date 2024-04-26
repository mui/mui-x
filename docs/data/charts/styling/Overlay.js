import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const emptySeries = {
  series: [],
  margin: { top: 10, right: 10, left: 25, bottom: 25 },
  height: 150,
};

export default function Overlay() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <LineChart loading {...emptySeries} />
      <LineChart {...emptySeries} />
    </Stack>
  );
}
