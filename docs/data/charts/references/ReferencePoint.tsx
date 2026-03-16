import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';

type UseReferencePointParams = {
  /**
   * @default 'start'
   */
  x?: string | number | 'start' | 'end';
  /**
   * @default 'start'
   */
  y?: number | 'start' | 'end';
};

type UseReferencePointResult = {
  x: number;
  y: number;
};

function resolveValue(
  /**
   * The value to resolve. Either an axis value, or 'start'/'end' to stick to the edges of the drawing area.
   */
  value: string | number | 'start' | 'end',
  /**
   * The axis scale to use.
   */
  scale: ScaleLinear<any, any> | ScalePoint<any>,
  /**
   * The start coordinate of the drawing area (left for x-axis, top for y-axis).
   */
  drawingStart: number,
  /**
   * The end coordinate of the drawing area (right for x-axis, bottom for y-axis).
   */
  drawingEnd: number,
): number {
  if (value === 'start') {
    return drawingStart;
  }
  if (value === 'end') {
    return drawingEnd;
  }

  // The value clamped between the drawing area boundaries.
  return (
    Math.max(drawingStart, Math.min(drawingEnd, scale(value as any)! as number)) ?? 0
  );
}

export function useReferencePoint(
  params: UseReferencePointParams,
): UseReferencePointResult {
  const { x: xProps, y: yProps } = params;

  const xScale = useXScale() as ScaleLinear<any, any> | ScalePoint<any>;
  const yScale = useYScale() as ScaleLinear<any, any>;
  const { left, top, width, height } = useDrawingArea();

  const x = resolveValue(xProps ?? 'start', xScale, left, left + width);
  const y = resolveValue(yProps ?? 'start', yScale, top, top + height);

  return { x, y };
}

type ReferencePointProps = UseReferencePointParams & {
  dx?: number;
  dy?: number;
} & React.SVGProps<SVGTextElement>;

export function ReferencePoint(props: ReferencePointProps) {
  const { x, y, dx = 0, dy = 0, children, ...other } = props;

  const pointCoordinates = useReferencePoint({ x, y });

  return (
    <text x={pointCoordinates.x + dx} y={pointCoordinates.y + dy} {...other}>
      {children}
    </text>
  );
}
