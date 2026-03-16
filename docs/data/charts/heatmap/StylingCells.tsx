import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function StylingCells() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        sx={{
          // Turn the cell at x=2, y=3 orange
          '& [data-x-index="2"][data-y-index="3"]': {
            fill: 'orange',
          },
        }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data }]}
        height={300}
      />
    </Box>
  );
}
