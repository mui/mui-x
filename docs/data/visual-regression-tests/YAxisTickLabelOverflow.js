import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import { useDrawingArea, useYAxes } from '@mui/x-charts/hooks';
import { usAirportPassengersData } from './airportData';

const defaultYAxis = {
  dataKey: 'code',
  width: 80,
  valueFormatter: (value) =>
    usAirportPassengersData.find((item) => item.code === value).fullName,
  label: '0deg Axis Title',
};

const degrees = [-135, -45, 0, 45, 135];

const yAxes = degrees
  .map((angle) => ({
    ...defaultYAxis,
    position: 'left',
    id: `angle${angle}`,
    label: `${angle}deg Axis Title`,
    tickLabelStyle: { angle },
  }))
  .concat(
    degrees.map((angle) => ({
      ...defaultYAxis,
      id: `right-angle${angle}`,
      label: `${angle}deg Axis Title`,
      position: 'right',
      tickLabelStyle: { angle },
    })),
  );

export default function YAxisTickLabelOverflow() {
  return (
    <BarChartPro
      yAxis={yAxes}
      // Other props
      width={850}
      height={400}
      dataset={usAirportPassengersData}
      layout="horizontal"
      series={[
        { dataKey: '2018', label: '2018' },
        { dataKey: '2019', label: '2019' },
        { dataKey: '2020', label: '2020' },
        { dataKey: '2021', label: '2021' },
        { dataKey: '2022', label: '2022' },
      ]}
      hideLegend
      xAxis={[
        {
          valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
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
  const axes = useYAxes();

  return (
    <React.Fragment>
      {axes.yAxisIds.map((id, i) => {
        const yAxis = axes.yAxis[id];
        if (yAxis.position === 'none') {
          return null;
        }

        const direction = yAxis.position === 'left' ? -1 : 1;
        const offset = yAxis.offset;
        const start =
          yAxis.position === 'left'
            ? left - yAxis.width + offset * direction
            : (left + width + offset) * direction;

        return (
          <rect
            key={id}
            x={start}
            y={top}
            width={yAxis.width ?? 0}
            height={height}
            fill={colors[i]}
            opacity={0.2}
          />
        );
      })}
    </React.Fragment>
  );
}
