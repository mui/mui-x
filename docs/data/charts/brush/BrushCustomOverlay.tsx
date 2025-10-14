import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useBrush, useDrawingArea } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function CustomBrushOverlay() {
  const theme = useTheme();
  const drawingArea = useDrawingArea();
  const { start, current } = useBrush();

  if (!start || !current) {
    return null;
  }

  const { left, top, width, height } = drawingArea;

  // Clamp coordinates to drawing area
  const clampX = (x: number) => Math.max(left, Math.min(left + width, x));
  const clampedStartX = clampX(start.x!);
  const clampedCurrentX = clampX(current.x!);

  const minX = Math.min(clampedStartX, clampedCurrentX);
  const maxX = Math.max(clampedStartX, clampedCurrentX);
  const rectWidth = maxX - minX;

  const color = theme.palette.primary.main;

  // Only show if there's meaningful movement
  if (rectWidth < 2) {
    return null;
  }

  return (
    <g>
      {/* Start line */}
      <line
        x1={clampedStartX}
        y1={top}
        x2={clampedStartX}
        y2={top + height}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />

      {/* Current line */}
      <line
        x1={clampedCurrentX}
        y1={top}
        x2={clampedCurrentX}
        y2={top + height}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />

      {/* Selection rectangle */}
      <rect
        x={minX}
        y={top}
        width={rectWidth}
        height={height}
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        strokeWidth={1}
        pointerEvents="none"
      />

      {/* Start label */}
      <g transform={`translate(${clampedStartX}, ${top + 15})`}>
        <rect x={-30} y={0} width={60} height={24} fill={color} rx={4} />
        <text
          x={0}
          y={16}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
        >
          Start
        </text>
      </g>

      {/* End label */}
      <g transform={`translate(${clampedCurrentX}, ${top + 45})`}>
        <rect x={-25} y={0} width={50} height={24} fill={color} rx={4} />
        <text
          x={0}
          y={16}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
        >
          End
        </text>
      </g>
    </g>
  );
}

export default function BrushCustomOverlay() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Custom brush overlay with labeled start and end positions.
      </Typography>
      <BarChart
        height={300}
        series={[
          {
            data: [45, 62, 58, 71],
            label: 'Revenue',
          },
        ]}
        enableBrush
        xAxis={[
          {
            data: ['Q1', 'Q2', 'Q3', 'Q4'],
            scaleType: 'band',
          },
        ]}
      >
        <CustomBrushOverlay />
      </BarChart>
    </Box>
  );
}
