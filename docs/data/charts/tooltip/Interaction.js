import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';

const barChartsParams = {
  xAxis: [
    {
      data: ['page A', 'page B', 'page C', 'page D', 'page E'],
      scaleType: 'band',
    },
  ],
  series: [
    { data: [2, 5, 3, 4, 1], stack: '1', label: 'series x' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series y' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series z' },
  ],
  margin: { top: 10, right: 10 },
  width: 400,
  height: 200,
};
export default function Interaction() {
  return (
    <div>
      <Stack direction="column">
        <BarChart {...barChartsParams} tooltip={{ trigger: 'axis' }} />
        <BarChart {...barChartsParams} tooltip={{ trigger: 'item' }} />
      </Stack>
    </div>
  );
}
