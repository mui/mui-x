import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function Pyramid() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [
              { label: "Above $30 a day", value: 16 },
              { label: "$10-$30 a day", value: 25 },
              { label: "$1.90-$10 a day", value: 50 },
              { label: "Below $1.90 a day", value: 9 },
            ],
          },
        ]}
        height={300}
      />
    </Box>
  );
}
