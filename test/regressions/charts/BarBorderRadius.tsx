import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';

const dataset = [
  [3, -7, 'First'],
  [0, -5, 'Second'],
  [10, 0, 'Third'],
  [9, 6, 'Fourth'],
  [1, 0, 'Fifth'],
  [0, -1, 'Sixth'],
  [1, -1, 'Seventh'],
  [2, -2, 'Eighth'],
].map(([high, low, order]) => ({
  high,
  low,
  order,
}));
const seriesH = [
  { dataKey: 'high', label: 'High', layout: 'horizontal', stack: 'stack' },
  { dataKey: 'low', label: 'Low', layout: 'horizontal', stack: 'stack' },
] satisfies BarChartProps['series'];
const seriesV = [
  { dataKey: 'high', label: 'High', stack: 'stack' },
  { dataKey: 'low', label: 'Low', stack: 'stack' },
] satisfies BarChartProps['series'];
const chartSettingsH = {
  margin: { left: 32 },
  dataset,
  width: 400,
  height: 400,
  series: seriesH,
  yAxis: [{ scaleType: 'band', dataKey: 'order', width: 12 }],
  hideLegend: true,
} satisfies BarChartProps;
const chartSettingsV = {
  ...chartSettingsH,
  margin: { left: 0 },
  xAxis: [{ dataKey: 'order', height: 8 }],
  yAxis: undefined,
  series: seriesV,
} satisfies BarChartProps;

export default function BarBorderRadius() {
  return (
    <div style={{ display: 'grid', gap: 2, gridTemplateColumns: 'auto repeat(2, 1fr)' }}>
      <div />
      <Typography sx={{ justifySelf: 'center' }}>Layout: Vertical</Typography>
      <Typography sx={{ justifySelf: 'center' }}>Layout: Horizontal</Typography>
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Border Radius: 4px
      </Typography>
      <BarChart {...chartSettingsV} borderRadius={4} />
      <BarChart {...chartSettingsH} borderRadius={4} />
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Border Radius: 16px
      </Typography>
      <BarChart {...chartSettingsV} borderRadius={16} />
      <BarChart {...chartSettingsH} borderRadius={16} />
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Border Radius: 100px
      </Typography>
      <BarChart {...chartSettingsV} borderRadius={100} />
      <BarChart {...chartSettingsH} borderRadius={100} />
      <Typography
        sx={{
          writingMode: 'vertical-lr',
          rotate: '180deg',
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      >
        Axis Reversed + Border Radius: 16px
      </Typography>
      <BarChart {...chartSettingsV} yAxis={[{ reverse: true }]} borderRadius={16} />
      <BarChart {...chartSettingsH} xAxis={[{ reverse: true }]} borderRadius={16} />
    </div>
  );
}
