import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function BasicFunnel() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart series={data} height={300} />
    </Box>
  );
}

const data = [
  {
    label: 'Stack',
    data: [
      {
        value: 200,
        label: 'first',
      },
      {
        value: 150,
        label: 'second',
      },
      {
        value: 100,
        label: 'third',
      },
      {
        value: 120,
        label: 'fourth',
      },
      {
        value: 20,
        label: 'fifth',
      },
    ],
  },
];
