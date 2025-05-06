import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

const ratios = [0.2, 0.8, 0.6, 0.5];

const LoadingRect = styled('rect')({
  opacity: 0.2,
  fill: 'lightgray',
});

const LoadingText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

function LoadingOverlay() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale();
  const { left, width, height } = useDrawingArea();

  const bandWidth = xScale.bandwidth();

  const [bottom, top] = yScale.range();

  return (
    <g>
      {xScale.domain().map((item, index) => {
        const ratio = ratios[index % ratios.length];
        const barHeight = ratio * (bottom - top);

        return (
          <LoadingRect
            key={index}
            x={xScale(item)}
            width={bandWidth}
            y={bottom - barHeight}
            height={height}
          />
        );
      })}
      <LoadingText x={left + width / 2} y={top + height / 2}>
        Loading data…
      </LoadingText>
    </g>
  );
}

export default function CustomOverlay() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <BarChart
        slotProps={{
          noDataOverlay: { message: 'No data to display in this chart' },
        }}
        series={[]}
        height={150}
      />
      <BarChart
        loading
        xAxis={[{ data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }]}
        slots={{ loadingOverlay: LoadingOverlay }}
        series={[]}
        height={150}
      />
    </Stack>
  );
}
