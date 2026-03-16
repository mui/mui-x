import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

function resolveValue(
  /**
   * The value to resolve. Either an axis value, or 'start'/'end' to stick to the edges of the drawing area.
   */
  value,
  /**
   * The axis scale to use.
   */
  scale,
  /**
   * The start coordinate of the drawing area (left for x-axis, top for y-axis).
   */
  drawingStart,
  /**
   * The end coordinate of the drawing area (right for x-axis, bottom for y-axis).
   */
  drawingEnd,
) {
  if (value === 'start') {
    return drawingStart;
  }
  if (value === 'end') {
    return drawingEnd;
  }

  // The value clamped between the drawing area boundaries.
  return Math.max(drawingStart, Math.min(drawingEnd, scale(value))) ?? 0;
}

export function useReferencePoint(params) {
  const { x: xProps, y: yProps } = params;

  const xScale = useXScale();
  const yScale = useYScale();
  const { left, top, width, height } = useDrawingArea();

  const x = resolveValue(xProps ?? 'start', xScale, left, left + width);
  const y = resolveValue(yProps ?? 'start', yScale, top, top + height);

  return { x, y };
}

export function ReferencePoint(props) {
  const { x, y, dx = 0, dy = 0, children, ...other } = props;

  const pointCoordinates = useReferencePoint({ x, y });

  return (
    <text x={pointCoordinates.x + dx} y={pointCoordinates.y + dy} {...other}>
      {children}
    </text>
  );
}
