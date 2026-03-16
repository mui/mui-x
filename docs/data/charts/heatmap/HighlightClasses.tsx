import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HighlightClasses() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        sx={{
          '& [data-highlighted]': {
            filter: 'none', // Remove the default filter effect.
            rx: '10px', // Round the corners
          },
          '& [data-faded]': {
            filter: 'saturated(95%)', // Reduce the faded default saturation
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
        height={300}
      />
    </Box>
  );
}
