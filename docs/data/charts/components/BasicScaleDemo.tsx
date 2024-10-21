import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { useDrawingArea } from '@mui/x-charts/hooks';

const StyledPath = styled('path')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  pointerEvents: 'none',
}));

const StyledText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

function DrawingAreaBox() {
  const { left, top, width, height } = useDrawingArea();
  return (
    <React.Fragment>
      <StyledPath
        d={`M ${left} ${top} l ${width} 0 l 0 ${height} l -${width} 0 Z`}
      />
      <circle cx={left} cy={top} r={3} style={{ fill: 'red' }} />
      <circle cx={left + width} cy={top + height} r={3} style={{ fill: 'red' }} />
      <StyledText
        x={left}
        y={top}
        textAnchor="start"
        dominantBaseline="text-after-edge"
      >
        ({left},{top})
      </StyledText>
      <StyledText
        x={left + width}
        y={top + height}
        textAnchor="end"
        dominantBaseline="text-before-edge"
      >
        ({left + width},{top + height})
      </StyledText>
    </React.Fragment>
  );
}
export default function BasicScaleDemo() {
  return (
    <ResponsiveChartContainer
      margin={{ top: 20, left: 10, right: 10, bottom: 30 }}
      height={300}
      series={[
        {
          type: 'line',
          data: [13, 13, 54, 651, 657, 987, 64, 654, 954, 654, 897, 84],
        },
      ]}
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }]}
    >
      <LinePlot />
      <DrawingAreaBox />
    </ResponsiveChartContainer>
  );
}
