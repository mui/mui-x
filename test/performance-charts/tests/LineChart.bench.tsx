import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { LineChart } from '@mui/x-charts/LineChart';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);
const yData = data.map((d) => d.y);

benchmark('LineChart with big data amount (with marks)', () => (
  <LineChart
    xAxis={[{ data: xData, domainLimit: 'nice' }]}
    series={[{ data: yData, showMark: true }]}
    width={500}
    height={300}
    skipAnimation
  />
));

benchmark('Area chart with big data amount (no marks)', () => (
  <LineChart
    xAxis={[{ data: xData, domainLimit: 'nice' }]}
    series={[{ area: true, data: yData, showMark: false }]}
    width={500}
    height={300}
    skipAnimation
  />
));

const stackedSeriesCount = 10;
const stackedSeries = Array.from({ length: stackedSeriesCount }, (_, s) => ({
  data: Array.from({ length: dataLength }, (__, i) => 5 + Math.sin((i + s) / 5) * 5),
  area: true,
  showMark: false,
  stack: 'total',
}));

benchmark('LineChart stacked area with multiple series', () => (
  <LineChart
    xAxis={[{ data: xData, domainLimit: 'nice' }]}
    series={stackedSeries}
    width={500}
    height={300}
    skipAnimation
  />
));

const dateOrigin = new Date(2020, 0, 1).getTime();
const dateXData = Array.from(
  { length: dataLength },
  (_, i) => new Date(dateOrigin + i * 24 * 3600 * 1000),
);

benchmark('LineChart with date axis and big data amount', () => (
  <LineChart
    xAxis={[
      {
        data: dateXData,
        scaleType: 'time',
        valueFormatter: (value: Date) => value.toLocaleDateString('en-US'),
      },
    ]}
    series={[{ data: yData, showMark: false }]}
    width={500}
    height={300}
    skipAnimation
  />
));
