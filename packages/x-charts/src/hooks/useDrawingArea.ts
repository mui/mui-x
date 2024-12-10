'use client';
import * as React from 'react';
import { DrawingAreaContext, DrawingAreaState } from '../context/DrawingAreaProvider';

export function useDrawingArea(): DrawingAreaState {
  const { left, top, width, height, bottom, right, isPointInside } =
    React.useContext(DrawingAreaContext);
  return React.useMemo(
    () => ({ left, top, width, height, bottom, right, isPointInside }),
    [height, left, top, width, bottom, right, isPointInside],
  );
}
