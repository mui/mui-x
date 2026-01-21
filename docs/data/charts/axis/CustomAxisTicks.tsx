import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { useYAxes, useYAxisCoordinates, useYAxisTicks } from '@mui/x-charts/hooks';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { ChartsYAxisProps } from '@mui/x-charts/models';

const labels = [
  'Server Products',
  'Enterprise Services',
  'M365 Commercial',
  'M365 Consumer',
  'LinkedIn',
  'Dynamics',
  'Gaming',
  'Windows & Devices',
  'Search & News Ads',
];

const data = [98.4, 7.7, 87.7, 7.4, 17.8, 7.8, 23.4, 17.3, 13.8];

const chartSetting = {
  height: 400,
  margin: { left: 0 },
  layout: 'horizontal',
  xAxis: [{ id: 'x' }],
  yAxis: [{ id: 'y', scaleType: 'band', data: labels, width: 4 }],
  series: [{ data }],
} satisfies BarChartProps;

export default function CustomAxisTicks() {
  return <BarChart {...chartSetting} slots={{ yAxis: YAxis }} />;
}

function YAxis(props: ChartsYAxisProps) {
  const theme = useTheme();
  const { yAxisIds } = useYAxes();
  const axisId = props.axisId ?? yAxisIds[0];

  const axisCoordinates = useYAxisCoordinates(axisId);
  const ticks = useYAxisTicks(axisId);

  if (!axisCoordinates) {
    return null;
  }

  return (
    <React.Fragment>
      <line
        x1={axisCoordinates.left}
        x2={axisCoordinates.left}
        y1={axisCoordinates.top}
        y2={axisCoordinates.bottom}
        stroke={theme.palette.common.white}
      />
      {ticks.map((tick, index) => (
        <g
          key={index}
          transform={`translate(${axisCoordinates.left}, ${tick.offset})`}
        >
          <line x1={-4} x2={4} stroke={theme.palette.common.white} />

          <text
            x={8}
            y={tick.labelOffset}
            dominantBaseline="central"
            textAnchor="start"
            fill={theme.palette.text.primary}
            fontSize={12}
          >
            {tick.formattedValue ?? ''}
          </text>
        </g>
      ))}
    </React.Fragment>
  );
}
