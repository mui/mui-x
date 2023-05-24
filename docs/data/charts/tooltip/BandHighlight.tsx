import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';

const barChartsParams = {
  xAxis: [
    {
      data: ['page A', 'page B', 'page C', 'page D', 'page E'],
      scaleType: 'band' as const,
    },
  ],
  series: [
    { data: [2, 5, 3, 4, 1], stack: '1', label: 'series x' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series y' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series z' },
  ],
  width: 600,
  height: 400,
};

export default function BandHighlight() {
  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <BarChart {...barChartsParams} highlight={{ x: 'band' }} />
      </Stack>
    </Box>
  );
}
