import * as React from 'react';

import { styled } from '@mui/material/styles';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { useDrawingArea, useYScale } from '@mui/x-charts/hooks';

const StyledPath = styled('path')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
  pointerEvents: 'none',
  strokeDasharray: '5 2',
}));

const StyledText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
}));

function ValueHighlight(props) {
  const { svgRef } = props;

  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
  const leftAxisScale = useYScale('left_axis_id');
  const rightAxisScale = useYScale('right_axis_id');

  const [mouseY, setMouseY] = React.useState(null);

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleMouseOut = () => {
      setMouseY(null);
    };

    const handleMouseMove = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      if (x < left || x > left + width) {
        setMouseY(null);
        return;
      }
      if (y < top - 10 || y > top + height + 10) {
        // Allows some margin if slightly on top/bottom of the drawing area
        setMouseY(null);
        return;
      }
      setMouseY(Math.max(Math.min(top + height, y), top)); // clamp to the drawing area
    };

    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [height, left, top, width, svgRef]);

  if (mouseY === null) {
    return null;
  }
  return (
    <React.Fragment>
      <StyledPath d={`M ${left} ${mouseY} l ${width} 0`} />
      <StyledText
        x={left + 5}
        y={mouseY}
        textAnchor="start"
        dominantBaseline="text-after-edge"
      >
        {leftAxisScale.invert(mouseY).toFixed(0)}
      </StyledText>

      <StyledText
        x={left + width - 5}
        y={mouseY}
        textAnchor="end"
        dominantBaseline="text-after-edge"
      >
        {rightAxisScale.invert(mouseY).toFixed(0)}
      </StyledText>
    </React.Fragment>
  );
}
export default function ScaleDemo() {
  const svgRef = React.useRef(null);
  return (
    <ResponsiveChartContainer
      ref={svgRef}
      margin={{ top: 20, left: 50, right: 50, bottom: 30 }}
      height={300}
      series={[
        {
          type: 'line',
          data: [5, 15, 20, 24, 30, 38, 40, 51, 52, 61],
          yAxisId: 'left_axis_id',
        },
        {
          type: 'line',
          data: [
            50134, 48361, 46362, 44826, 42376, 40168, 38264, 36159, 34259, 32168,
          ],
          yAxisId: 'right_axis_id',
        },
      ]}
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point' }]}
      yAxis={[
        {
          id: 'left_axis_id',
        },
        {
          id: 'right_axis_id',
        },
      ]}
    >
      <LinePlot />
      <ChartsYAxis position="left" axisId="left_axis_id" />
      <ChartsYAxis position="right" axisId="right_axis_id" />
      <ValueHighlight svgRef={svgRef} />
    </ResponsiveChartContainer>
  );
}
