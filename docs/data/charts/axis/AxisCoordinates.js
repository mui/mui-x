import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import {
  useXAxis,
  useXAxisCoordinates,
  useYAxis,
  useYAxisCoordinates,
} from '@mui/x-charts/hooks';

import { useTheme } from '@mui/material/styles';

const lineData = [2, 5, 3, 8, 4];
const xAxisData = [1, 2, 3, 4, 5];

const colors = [
  '#e63946', // red
  '#f4a261', // orange
  '#e9c46a', // yellow
  '#2a9d8f', // teal
  '#264653', // dark blue
  '#8338ec', // purple
  '#3a86ff', // blue
  '#06d6a0', // green
];

export default function AxisCoordinates() {
  return (
    <ChartContainer
      series={[
        {
          type: 'line',
          data: lineData,
          yAxisId: 'y-left-1',
          xAxisId: 'x-bottom-1',
        },
      ]}
      xAxis={[
        { id: 'x-bottom-1', data: xAxisData, height: 60 },
        { id: 'x-bottom-2', data: xAxisData, height: 30, position: 'bottom' },
        { id: 'x-top-1', data: xAxisData, height: 60, position: 'top' },
        { id: 'x-top-2', data: xAxisData, height: 30, position: 'top' },
      ]}
      yAxis={[
        { id: 'y-left-1', width: 60 },
        { id: 'y-left-2', width: 30, position: 'left' },
        { id: 'y-right-1', width: 60, position: 'right' },
        { id: 'y-right-2', width: 30, position: 'right' },
      ]}
      axesGap={8}
      width={500}
      height={500}
    >
      <LinePlot />
      <XAxisPositionIndicator axisId="x-bottom-1" color={colors[0]} />
      <XAxisPositionIndicator axisId="x-bottom-2" color={colors[1]} />
      <XAxisPositionIndicator axisId="x-top-1" color={colors[2]} />
      <XAxisPositionIndicator axisId="x-top-2" color={colors[3]} />
      <YAxisPositionIndicator axisId="y-left-1" color={colors[4]} />
      <YAxisPositionIndicator axisId="y-left-2" color={colors[5]} />
      <YAxisPositionIndicator axisId="y-right-1" color={colors[6]} />
      <YAxisPositionIndicator axisId="y-right-2" color={colors[7]} />
      {/* Render the actual axes */}
      <ChartsXAxis axisId="x-bottom" />
      <ChartsXAxis axisId="x-top" />
      <ChartsYAxis axisId="y-left" />
      <ChartsYAxis axisId="y-right" />
    </ChartContainer>
  );
}

function XAxisPositionIndicator({ axisId, color }) {
  const xPosition = useXAxisCoordinates(axisId);
  const xAxis = useXAxis(axisId);

  if (!xPosition) {
    return null;
  }

  return (
    <AxisPositionIndicator
      axisId={axisId}
      position={xAxis.position ?? 'bottom'}
      direction="x"
      coordinates={xPosition}
      color={color}
    />
  );
}

function YAxisPositionIndicator({ axisId, color }) {
  const yPosition = useYAxisCoordinates(axisId);
  const yAxis = useYAxis(axisId);

  if (!yPosition) {
    return null;
  }

  return (
    <AxisPositionIndicator
      axisId={axisId}
      position={yAxis.position ?? 'left'}
      direction="y"
      coordinates={yPosition}
      color={color}
    />
  );
}

function AxisPositionIndicator({ axisId, position, direction, coordinates, color }) {
  const theme = useTheme();

  if (position === 'none') {
    return null;
  }

  const centerX = coordinates.left + (coordinates.right - coordinates.left) / 2;
  const centerY = coordinates.top + (coordinates.bottom - coordinates.top) / 2;

  return (
    <React.Fragment>
      <rect
        x={coordinates.left}
        y={coordinates.top}
        width={coordinates.right - coordinates.left}
        height={coordinates.bottom - coordinates.top}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2}
      />
      <text
        x={centerX}
        y={centerY}
        width={coordinates.right - coordinates.left}
        height={coordinates.bottom - coordinates.top}
        dominantBaseline="central"
        textAnchor="middle"
        transform={
          direction === 'y'
            ? `rotate(${position === 'right' ? 90 : -90} ${centerX} ${centerY})`
            : undefined
        }
        fill={theme.palette.text.primary}
      >
        {axisId}
      </text>
    </React.Fragment>
  );
}
