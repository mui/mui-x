'use client';
import * as React from 'react';
import useId from '@mui/utils/useId';
import useChartDimensions from '../../hooks/useChartDimensions';
import { DrawingAreaProviderProps, DrawingAreaState } from './DrawingArea.types';
import { DrawingAreaContext } from './DrawingAreaContext';

export function DrawingAreaProvider(props: DrawingAreaProviderProps) {
  const { width, height, margin, children } = props;
  const drawingArea = useChartDimensions(width, height, margin);
  const chartId = useId();

  const isPointInside = React.useCallback<DrawingAreaState['isPointInside']>(
    ({ x, y }, options) => {
      // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
      if (options?.targetElement && options?.targetElement.closest('[data-drawing-container]')) {
        return true;
      }

      const isInsideX = x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width;
      const isInsideY = y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height;

      if (options?.direction === 'x') {
        return isInsideX;
      }

      if (options?.direction === 'y') {
        return isInsideY;
      }

      return isInsideX && isInsideY;
    },
    [drawingArea],
  );

  const value = React.useMemo(
    () => ({ chartId: chartId ?? '', ...drawingArea, isPointInside }),
    [chartId, drawingArea, isPointInside],
  );

  return <DrawingAreaContext.Provider value={value}>{children}</DrawingAreaContext.Provider>;
}
