import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function BrushZoom() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Click and drag on the chart to select an area to zoom into. Double-tap to
        reset the zoom.
      </Typography>
      <LineChartPro
        height={300}
        series={[
          {
            data: yData,
            label: 'Temperature (°C)',
            area: true,
          },
        ]}
        xAxis={[
          {
            data: xData,
            scaleType: 'point',
            zoom: true,
          },
        ]}
        zoomInteractionConfig={{
          // Enable brush zoom and double-tap reset
          zoom: ['brush', 'doubleTapReset'],
          // Disable default interactions for this demo
          pan: [],
        }}
      />
    </Box>
  );
}

const xData = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const yData = [2, 5.5, 9, 13.5, 18, 21, 23.5, 23, 20, 15, 9, 4];
