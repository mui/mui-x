import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import { useDrawingArea, useXAxes } from '@mui/x-charts/hooks';
import { usAirportPassengersData } from './airportData';

const defaultXAxis = {
  dataKey: 'code',
  height: 80,
  valueFormatter: (value) =>
    usAirportPassengersData.find((item) => item.code === value).fullName,
  label: '0deg Axis Title',
};

const degrees = [-180, -135, -90, -45, 0, 45, 90, 135, 180];

const xAxes = degrees
  .map((angle) => ({
    ...defaultXAxis,
    position: 'bottom',
    id: `angle${angle}`,
    label: `${angle}deg Axis Title`,
    tickLabelStyle: { angle },
  }))
  .concat(
    degrees.map((angle) => ({
      ...defaultXAxis,
      id: `top-angle${angle}`,
      label: `${angle}deg Axis Title`,
      position: 'top',
      tickLabelStyle: { angle },
    })),
  );

export default function XAxisTickLabelOverflow() {
  return (
    <BarChartPro
      xAxis={xAxes}
      // Other props
      height={1600}
      dataset={usAirportPassengersData}
      series={[
        { dataKey: '2018', label: '2018' },
        { dataKey: '2019', label: '2019' },
        { dataKey: '2020', label: '2020' },
        { dataKey: '2021', label: '2021' },
        { dataKey: '2022', label: '2022' },
      ]}
      hideLegend
      yAxis={[
        {
          valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
          width: 60,
        },
      ]}
    >
      <AxisSizeVisualization />
    </BarChartPro>
  );
}

const colors = [
  '#FF3A2E', // Bright red
  '#9C27B0', // Purple
  '#7FDBFF', // Light blue
  '#2958B2', // Deep blue
  '#0F1D3A', // Dark navy
  '#00CCAA', // Teal
  '#8B008B', // Dark magenta
  '#FFD700', // Gold
  '#9932CC', // Dark orchid
  '#556B2F', // Dark olive green
  '#20B2AA', // Light sea green
  '#FF1493', // Deep pink
  '#FF0099', // Hot pink
  '#8A2BE2', // Blue violet
  '#FF6B1A', // Deep orange
  '#66CC00', // Lime green
  '#3D5A1A', // Forest green
  '#8C4A00', // Brown
];

function AxisSizeVisualization() {
  const { left, top, height, width } = useDrawingArea();
  const axes = useXAxes();

  return (
    <React.Fragment>
      {axes.xAxisIds.map((id, i) => {
        const xAxis = axes.xAxis[id];
        if (xAxis.position === 'none') {
          return null;
        }

        const direction = xAxis.position === 'top' ? -1 : 1;
        const offset = xAxis.offset;
        const start =
          xAxis.position === 'top'
            ? top - xAxis.height + offset * direction
            : (top + height + offset) * direction;

        return (
          <rect
            key={id}
            x={left}
            y={start}
            width={width}
            height={xAxis.height ?? 0}
            fill={colors[i]}
            opacity={0.2}
          />
        );
      })}
    </React.Fragment>
  );
}
