import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const dataLength = 800;
const xData = Array.from({ length: dataLength }, (_, i) => i);
const rangeData = Array.from({ length: dataLength }, (_, i) => {
  const low = 50 + Math.sin(i / 5) * 25;
  const high = low + 10 + Math.cos(i / 7) * 5;
  return [low, high] as [number, number];
});

benchmark('RangeBarChart with big data amount', () => (
  <BarChartPremium
    xAxis={[{ data: xData }]}
    series={[{ type: 'rangeBar', data: rangeData }]}
    width={500}
    height={300}
    skipAnimation
  />
));
