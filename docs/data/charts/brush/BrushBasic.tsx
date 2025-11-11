import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function BrushBasic() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Click and drag on the chart to see the brush selection overlay.
      </Typography>
      <BarChart
        height={300}
        series={[
          {
            data: [4, 8, 6, 12, 9, 15, 11, 14, 13, 18, 16, 20],
            label: 'Sales',
          },
        ]}
        brushConfig={{ enabled: true }}
        xAxis={[{ data: xAxisData }]}
      >
        <ChartsBrushOverlay />
      </BarChart>
    </Box>
  );
}

const xAxisData = [
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
