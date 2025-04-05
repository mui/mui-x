import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
export default function LineChartConnectNulls() {
  return (
    <Stack sx={{ width: '100%' }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data }]}
        height={200}
        margin={margin}
      />
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data, connectNulls: true }]}
        height={200}
        margin={margin}
      />
    </Stack>
  );
}
