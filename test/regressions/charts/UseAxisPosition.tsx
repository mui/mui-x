import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { useXAxisPosition, useYAxisPosition } from '@mui/x-charts/hooks';
import { AxisId } from '@mui/x-charts/internals';

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

// Component to visualize axis positions
function AxisPositionIndicator({
  axisId,
  axis,
  color,
}: {
  axisId: AxisId;
  axis: 'x' | 'y';
  color: string;
}) {
  const xPosition = useXAxisPosition(axis === 'x' ? axisId : 'x-bottom');
  const yPosition = useYAxisPosition(axis === 'y' ? axisId : 'y-left');

  const position = axis === 'x' ? xPosition : yPosition;

  return (
    <rect
      x={position.left}
      y={position.top}
      width={position.right - position.left}
      height={position.bottom - position.top}
      fill={`${color}33`}
      stroke={color}
      strokeWidth={2}
    />
  );
}

export default function UseAxisPosition() {
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
        { id: 'x-bottom-1', data: xAxisData, height: 60, position: 'bottom' },
        { id: 'x-bottom-2', data: xAxisData, height: 30, position: 'bottom' },
        { id: 'x-top-1', data: xAxisData, height: 60, position: 'top' },
        { id: 'x-top-2', data: xAxisData, height: 30, position: 'top' },
      ]}
      yAxis={[
        { id: 'y-left-1', width: 60, position: 'left' },
        { id: 'y-left-2', width: 30, position: 'left' },
        { id: 'y-right-1', width: 60, position: 'right' },
        { id: 'y-right-2', width: 30, position: 'right' },
      ]}
      width={500}
      height={500}
    >
      <LinePlot />
      <AxisPositionIndicator axisId="x-bottom-1" axis="x" color={colors[0]} />
      <AxisPositionIndicator axisId="x-bottom-2" axis="x" color={colors[1]} />
      <AxisPositionIndicator axisId="x-top-1" axis="x" color={colors[2]} />
      <AxisPositionIndicator axisId="x-top-2" axis="x" color={colors[3]} />
      <AxisPositionIndicator axisId="y-left-1" axis="y" color={colors[4]} />
      <AxisPositionIndicator axisId="y-left-2" axis="y" color={colors[5]} />
      <AxisPositionIndicator axisId="y-right-1" axis="y" color={colors[6]} />
      <AxisPositionIndicator axisId="y-right-2" axis="y" color={colors[7]} />
      {/* Render the actual axes */}
      <ChartsXAxis axisId="x-bottom" />
      <ChartsXAxis axisId="x-top" />
      <ChartsYAxis axisId="y-left" />
      <ChartsYAxis axisId="y-right" />
    </ChartContainer>
  );
}
