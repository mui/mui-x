import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
export default function LineChartConnectNulls() {
  return (
    <Stack sx={{ width: '100%', height: 400 }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point', height: 28 }]}
        series={[{ data }]}
        margin={margin}
      />
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point', height: 28 }]}
        series={[{ data, connectNulls: true }]}
        margin={margin}
      />
    </Stack>
  );
}
