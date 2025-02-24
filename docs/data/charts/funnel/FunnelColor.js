import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelColor() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        colors={['lightcoral', 'red']} // Use custom colors
        series={[
          {
            data: [
              { value: 20 }, // Get color from the palette
              { value: 10, color: 'slateblue' }, // Override palette color (red)
            ],
          },
        ]}
        height={300}
      />
    </Box>
  );
}
