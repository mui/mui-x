import * as React from 'react';
import { styled } from '@mui/material/styles';

import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

const x = Array.from({ length: 21 }, (_, index) => -1 + 0.2 * index);
const linear = x.map((v) => -1 + v);
const poly = x.map((v) => -1 + v ** 2 - v);

const StyledPath = styled('path')(({ theme, color }) => ({
  fill: 'none',
  stroke: theme.palette.text[color],
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  pointerEvents: 'none',
}));

function CartesianAxis() {
  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
  const yAxisScale = useYScale();
  const xAxisScale = useXScale();

  const yOrigin = yAxisScale(0);
  const xOrigin = xAxisScale(0);

  const xTicks = [-2, -1, 1, 2, 3];
  const yTicks = [-2, -1, 1, 2, 3, 4, 5];

  return (
    <React.Fragment>
      {yTicks.map((value) => (
        <StyledPath
          key={value}
          d={`M ${left} ${yAxisScale(value)} l ${width} 0`}
          color="secondary"
        />
      ))}
      {xTicks.map((value) => (
        <StyledPath
          key={value}
          d={`M ${xAxisScale(value)} ${top} l 0 ${height}`}
          color="secondary"
        />
      ))}
      <StyledPath d={`M ${left} ${yOrigin} l ${width} 0`} color="primary" />
      <StyledPath d={`M ${xOrigin} ${top} l 0 ${height}`} color="primary" />
    </React.Fragment>
  );
}
export default function OriginDemo() {
  return (
    <ResponsiveChartContainer
      margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
      height={300}
      series={[
        {
          type: 'line',
          data: linear,
        },
        {
          type: 'line',
          data: poly,
        },
      ]}
      xAxis={[{ data: x, scaleType: 'linear', min: -1, max: 3 }]}
      yAxis={[{ min: -2, max: 5 }]}
    >
      <CartesianAxis />
      <LinePlot />
    </ResponsiveChartContainer>
  );
}
