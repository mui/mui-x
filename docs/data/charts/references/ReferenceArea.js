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

function useReferenceArea(params) {
  const { x1: x1Props, x2: x2Props, y1: y1Props, y2: y2Props } = params;

  const xScale = useXScale();
  const yScale = useYScale();
  const { left, top, width, height } = useDrawingArea();

  const x1 = resolveValue(x1Props ?? 'start', xScale, left, left + width);
  const x2 = resolveValue(x2Props ?? 'end', xScale, left, left + width);

  const y1 = resolveValue(y1Props ?? 'start', yScale, top, top + height);
  const y2 = resolveValue(y2Props ?? 'end', yScale, top, top + height);

  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}
export function ReferenceArea(props) {
  const { x1, x2, y1, y2, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return <rect {...rectCoordinates} {...other} />;
}

export function ReferenceAreaLabel(props) {
  const { x1, x2, y1, y2, children, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return (
    <text x={rectCoordinates.x + 5} y={rectCoordinates.y + 5} {...other}>
      {children}
    </text>
  );
}
