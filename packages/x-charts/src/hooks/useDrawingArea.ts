import * as React from 'react';
import { DrawingArea, DrawingContext } from '../context/DrawingProvider';

export function useDrawingArea(): DrawingArea {
  const { left, top, width, height, bottom, right, isPointInside } =
    React.useContext(DrawingContext);
  return React.useMemo(
    () => ({ left, top, width, height, bottom, right, isPointInside }),
    [height, left, top, width, bottom, right, isPointInside],
  );
}
