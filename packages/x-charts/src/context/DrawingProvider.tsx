import * as React from 'react';
import useChartDimensions from '../hooks/useChartDimensions';
import { LayoutConfig } from '../models/layout';

export interface DrawingProviderProps extends LayoutConfig {
  children: React.ReactNode;
}

/**
 * Defines the area in which it is possible to draw the charts
 */
export type DrawingArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const DrawingContext = React.createContext<DrawingArea>({
  top: 0,
  left: 0,
  height: 300,
  width: 400,
});

export function DrawingProvider({ width, height, margin, children }: DrawingProviderProps) {
  const drawingArea = useChartDimensions(width, height, margin);

  return <DrawingContext.Provider value={drawingArea}>{children}</DrawingContext.Provider>;
}
