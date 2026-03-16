import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';

type UseReferenceAreaParams = {
  /**
   * @default 'start'
   */
  x1?: string | number | 'start' | 'end';
  /**
   * @default 'end'
   */
  x2?: string | number | 'start' | 'end';
  /**
   * @default 'start'
   */
  y1?: number | 'start' | 'end';
  /**
   * @default 'end'
   */
  y2?: number | 'start' | 'end';
};

type UseReferenceAreaResult = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ReferenceAreaProps = UseReferenceAreaParams & React.SVGProps<SVGRectElement>;
type ReferenceAreaLabelProps = UseReferenceAreaParams &
  React.SVGProps<SVGTextElement>;

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

function useReferenceArea(params: UseReferenceAreaParams): UseReferenceAreaResult {
  const { x1: x1Props, x2: x2Props, y1: y1Props, y2: y2Props } = params;

  const xScale = useXScale() as ScaleLinear<any, any> | ScalePoint<any>;
  const yScale = useYScale() as ScaleLinear<any, any>;
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
export function ReferenceArea(props: ReferenceAreaProps) {
  const { x1, x2, y1, y2, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return <rect {...rectCoordinates} {...other} />;
}

export function ReferenceAreaLabel(props: ReferenceAreaLabelProps) {
  const { x1, x2, y1, y2, children, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return (
    <text x={rectCoordinates.x + 5} y={rectCoordinates.y + 5} {...other}>
      {children}
    </text>
  );
}
