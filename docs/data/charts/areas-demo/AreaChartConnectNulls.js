import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
const margin = { right: 24 };

export default function AreaChartConnectNulls() {
  return (
    <Stack sx={{ width: '100%', height: 400 }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point', height: 28 }]}
        series={[{ data, area: true }]}
        margin={margin}
      />
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point', height: 28 }]}
        series={[{ data, area: true, connectNulls: true }]}
        margin={margin}
      />
    </Stack>
  );
}
