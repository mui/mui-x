import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap, heatmapClasses } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HighlightClasses() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        sx={{
          [`.${heatmapClasses.cell}`]: {
            [`&.${heatmapClasses.highlighted}`]: {
              filter: 'none', // Remove the default filter effect.
              rx: '10px', // Round the corners
            },
            [`&.${heatmapClasses.faded}`]: {
              filter: 'saturated(95%)', // Reduce the faded default saturation
            },
          },
        }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[
          {
            data,
            highlightScope: {
              highlight: 'item',
              fade: 'global',
            },
          },
        ]}
        margin={{ top: 5, right: 5, left: 20 }}
        height={300}
      />
    </Box>
  );
}
