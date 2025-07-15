import * as React from 'react';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';

const series = [
  {
    data: [
      { id: 0, value: 10, label: 'Series A' },
      { id: 1, value: 15, label: 'Series B' },
      { id: 2, value: 20, label: 'Series C' },
      { id: 3, value: 10, label: 'Series D' },
      { id: 4, value: 15, label: 'Series E' },
      { id: 5, value: 20, label: 'Series F' },
      { id: 6, value: 10, label: 'Series G' },
      { id: 7, value: 15, label: 'Series H' },
      { id: 8, value: 20, label: 'Series I' },
      { id: 9, value: 10, label: 'Series J' },
      { id: 10, value: 15, label: 'Series K' },
      { id: 11, value: 20, label: 'Series L' },
      { id: 12, value: 10, label: 'Series M' },
      { id: 13, value: 15, label: 'Series N' },
      { id: 14, value: 20, label: 'Series O' },
    ],
  },
];

export default function ScrollableLegend() {
  return (
    <Stack height={200} width={200}>
      <PieChart
        series={series}
        sx={{
          height: '100%',
        }}
        slotProps={{
          legend: {
            sx: {
              overflowY: 'scroll',
              flexWrap: 'nowrap',
              height: '100%',
            },
          },
        }}
      />
    </Stack>
  );
}
