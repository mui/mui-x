import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelGap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
          },
        ]}
        height={300}
      />
    </Box>
  );
}
