import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function SimpleAreaChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[{ data: uData, label: 'uv', area: true }]}
        xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
        sx={{
          [`& .${lineClasses.line}`]: {
            display: 'none',
          },
        }}
        margin={margin}
      />
    </Box>
  );
}
