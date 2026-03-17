import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

import { resolveValue } from './resolveValue';

export function useReferencePoint(params) {
  const { x: xProps, y: yProps } = params;

  const xScale = useXScale();
  const yScale = useYScale();
  const { left, top, width, height } = useDrawingArea();

  const x = resolveValue(xProps ?? 'start', xScale, left, left + width, 'start');
  const y = resolveValue(yProps ?? 'start', yScale, top, top + height, 'end');

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
