'use client';
import * as React from 'react';
import { DrawingAreaState } from './DrawingArea.types';

export const DrawingAreaContext = React.createContext<DrawingAreaState>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
  isPointInside: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  DrawingAreaContext.displayName = 'DrawingContext';
}
