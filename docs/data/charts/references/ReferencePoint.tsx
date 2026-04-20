import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { resolveValue } from './resolveValue';

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

export function useReferencePoint(
  params: UseReferencePointParams,
): UseReferencePointResult {
  const { x: xProps, y: yProps } = params;

  const xScale = useXScale() as ScaleLinear<any, any> | ScalePoint<any>;
  const yScale = useYScale() as ScaleLinear<any, any>;
  const { left, top, width, height } = useDrawingArea();

  const x = resolveValue(xProps ?? 'start', xScale, left, left + width, 'start');
  const y = resolveValue(yProps ?? 'start', yScale, top, top + height, 'end');

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
