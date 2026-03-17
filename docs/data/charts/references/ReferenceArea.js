import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

import { resolveValue } from './resolveValue';

function useReferenceArea(params) {
  const { x1: x1Props, x2: x2Props, y1: y1Props, y2: y2Props } = params;

  const xScale = useXScale();
  const yScale = useYScale();
  const { left, top, width, height } = useDrawingArea();

  const x1 = resolveValue(x1Props ?? 'start', xScale, left, left + width, 'start');
  const x2 = resolveValue(x2Props ?? 'end', xScale, left, left + width, 'end');

  const y1 = resolveValue(y1Props ?? 'start', yScale, top, top + height, 'start');
  const y2 = resolveValue(y2Props ?? 'end', yScale, top, top + height, 'end');

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
  const { x1, x2, y1, y2, dx, dy, children, ...other } = props;

  const rectCoordinates = useReferenceArea({ x1, x2, y1, y2 });

  return (
    <text
      x={rectCoordinates.x + (dx ?? 0)}
      y={rectCoordinates.y + (dy ?? 0)}
      {...other}
    >
      {children}
    </text>
  );
}
