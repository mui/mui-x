'use client';
import * as React from 'react';
import { DrawingAreaState } from './DrawingArea.types';

export const DrawingAreaContext = React.createContext<
  DrawingAreaState & {
    /**
     * A random id used to distinguish each chart on the same page.
     */
    chartId: string;
  }
>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
  chartId: '',
  isPointInside: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  DrawingAreaContext.displayName = 'DrawingContext';
}
