import * as React from 'react';
import {
  LineChart,
  LineChartProps,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import {
  ChartsLabelCustomMarkProps,
  labelMarkClasses,
} from '@mui/x-charts/ChartsLabel';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

const settings = {
  series: [
    { data: pData, label: 'pv', id: 'pvId', labelMarkType: Line },
    { data: uData, label: 'uv', id: 'uvId', labelMarkType: Line },
  ],
  xAxis: [{ scaleType: 'point', data: xLabels }],
  yAxis: [{ width: 50 }],
  height: 300,
  margin: { right: 24 },
} satisfies LineChartProps;

export default function LegendStyleSeries() {
  return (
    <LineChart
      {...settings}
      sx={{
        [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
          strokeWidth: 1,
        },
        [`.MuiLineElement-series-pvId, .${legendClasses.item}[data-series="pvId"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '5 5',
          },
        [`.MuiLineElement-series-uvId, .${legendClasses.item}[data-series="uvId"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '3 4 5 2',
          },
        [`.${legendClasses.mark}`]: {
          width: 24,
        },
      }}
    />
  );
}

function Line({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="0 0 24 4">
      <line
        className={className}
        x1={0}
        y1={2}
        x2={24}
        y2={2}
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
}
