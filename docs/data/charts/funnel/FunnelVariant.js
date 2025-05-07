import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelVariant() {
  const data = [
    { value: 200, label: 'Leads' },
    { value: 150, label: 'Calls' },
    { value: 90, label: 'Meetings' },
    { value: 40, label: 'Deals' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data,
            variant: 'outlined',
          },
        ]}
        height={300}
      />
    </Box>
  );
}
