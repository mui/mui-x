'use client';
import * as React from 'react';
import { DrawingAreaContext, DrawingAreaState } from '../context/DrawingAreaProvider';

/**
 * Get the drawing area dimensions and coordinates. The drawing area is the area where the chart is rendered.
 *
 * It includes the left, top, width, height, bottom, right, and a function to check if a given point is inside the drawing area.
 *
 * @returns {DrawingAreaState} The drawing area dimensions.
 */
export function useDrawingArea(): DrawingAreaState {
  const { left, top, width, height, bottom, right, isPointInside } =
    React.useContext(DrawingAreaContext);
  return React.useMemo(
    () => ({ left, top, width, height, bottom, right, isPointInside }),
    [height, left, top, width, bottom, right, isPointInside],
  );
}
