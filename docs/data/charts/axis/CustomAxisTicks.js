import { BarChart } from '@mui/x-charts/BarChart';
import { useXAxisTicks, useYAxisTicks } from '@mui/x-charts/hooks';
import * as React from 'react';

import { useTheme } from '@mui/material/styles';

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
};

export default function CustomAxisTicks() {
  return <BarChart {...chartSetting} slots={{ axisTicks: AxisTicks }} />;
}

function AxisTicks(props) {
  if (props.direction === 'x') {
    return <XAxisTicks {...props} />;
  }

  return <YAxisTicks {...props} />;
}

function XAxisTicks(props) {
  const { axisId } = props;
  const ticks = useXAxisTicks(axisId);
  const theme = useTheme();

  return (
    <React.Fragment>
      {ticks.map((tick, index) => (
        <g key={index} transform={`translate(${tick.offset}, 0)`}>
          <line y2={8} stroke={theme.palette.common.white} />
          <text
            x={tick.labelOffset}
            y={12}
            fill={theme.palette.text.primary}
            dominantBaseline="hanging"
            textAnchor="middle"
            fontSize={12}
          >
            {tick.formattedValue ?? ''}
          </text>
        </g>
      ))}
    </React.Fragment>
  );
}

function YAxisTicks(props) {
  const { axisId } = props;
  const ticks = useYAxisTicks(axisId);
  const theme = useTheme();

  return (
    <React.Fragment>
      {ticks.map((tick, index) => (
        <g key={index} transform={`translate(0, ${tick.offset})`}>
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
