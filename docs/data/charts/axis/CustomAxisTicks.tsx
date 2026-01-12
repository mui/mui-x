import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { useDrawingArea, useYAxisTicks } from '@mui/x-charts/hooks';
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
  const { axisId } = props;
  const drawingArea = useDrawingArea();
  const ticks = useYAxisTicks(axisId);
  const theme = useTheme();

  return (
    <React.Fragment>
      <line
        x1={drawingArea.left}
        x2={drawingArea.left}
        y1={drawingArea.top}
        y2={drawingArea.top + drawingArea.height}
        stroke={theme.palette.common.white}
      />
      {ticks.map((tick, index) => (
        <g key={index} transform={`translate(${drawingArea.left}, ${tick.offset})`}>
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
