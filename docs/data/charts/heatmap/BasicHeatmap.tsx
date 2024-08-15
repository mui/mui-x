import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function BasicHeatmap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] }]}
        series={[{ data }]}
        margin={{ top: 5, right: 5, left: 20 }}
        height={300}
      />
    </Box>
  );
}
