import * as React from 'react';
import Box from '@mui/material/Box';
import '@mui/x-charts-pro/typeOverloads';
import { UnstableHeatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HighlightHeatmap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <UnstableHeatmap
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data, highlightScope: { highlight: 'item', fade: 'global' } }]}
        margin={{ top: 5, right: 5, left: 20 }}
        height={300}
      />
    </Box>
  );
}
