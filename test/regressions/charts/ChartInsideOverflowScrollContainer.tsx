import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

export default function SimpleLineChart() {
  return (
    <Box
      sx={{
        height: 300,
        width: 400,
        overflow: 'scroll',
        border: '1px solid grey',
      }}
    >
      <LineChart
        series={[
          { data: pData, label: 'pv' },
          { data: uData, label: 'uv' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ width: 50 }]}
        width={800}
      />
    </Box>
  );
}
