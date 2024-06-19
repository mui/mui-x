import * as React from 'react';
import Box from '@mui/material/Box';
import '@mui/x-charts-pro/typeOverloads';
import { UnstableHeatmap, heatmapClasses } from '@mui/x-charts-pro/Heatmap';

const data = [
  [0, 0, 1],
  [0, 1, 2],
  [0, 2, 4],
  [0, 3, 5],
  [0, 4, 2],
  [1, 0, 3],
  [1, 1, 5],
  [1, 2, 1],
  [1, 3, 2],
  [1, 4, 4],
  [2, 0, 5],
  [2, 1, 2],
  [2, 2, 3],
  [2, 3, 1],
  [2, 4, 2],
  [3, 0, 4],
  [3, 1, 5],
  [3, 2, 2],
  [3, 3, 3],
  [3, 4, 5],
];

export default function HighlightClasses() {
  console.log([`& .${heatmapClasses.cell}.${heatmapClasses.highlighted}`]);
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <UnstableHeatmap
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
