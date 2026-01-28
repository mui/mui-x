import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HeatmapLegend() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data }]}
        height={300}
        hideLegend={false}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { vertical: 'middle' },
            sx: { height: 200 },
          },
        }}
      />
    </Box>
  );
}
