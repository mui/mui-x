import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';

export function useDrawingArea() {
  const { left, top, width, height, bottom, right } = React.useContext(DrawingContext);
  return React.useMemo(
    () => ({ left, top, width, height, bottom, right }),
    [height, left, top, width, bottom, right],
  );
}
