import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';

export function useDrawingArea() {
  const { left, top, width, height } = React.useContext(DrawingContext);
  return React.useMemo(() => ({ left, top, width, height }), [height, left, top, width]);
}
