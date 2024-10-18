import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts/FunnelChart';

export default function BasicFunnel() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart series={data} height={300} />
    </Box>
  );
}

const data = [
  {
    label: 'first',
    data: [200],
  },
  {
    label: 'second',
    data: [150],
  },
  {
    label: 'third',
    data: [100],
  },
  {
    label: 'fourth',
    data: [120],
  },
  {
    label: 'fifth',
    data: [20],
  },
];
