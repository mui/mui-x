'use client';
import * as React from 'react';
import type { TimeGridEvent } from './TimeGridEvent';

export interface TimeGridEventContext {
  /**
   * Sets whether the event is being resized.
   */
  setIsResizing: (isResizing: boolean) => void;
  getSharedDragData: (input: { clientY: number }) => TimeGridEvent.SharedDragData;
}

export const TimeGridEventContext = React.createContext<TimeGridEventContext | undefined>(
  undefined,
);

export function useTimeGridEventContext() {
  const context = React.useContext(TimeGridEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridEventContext` is missing. TimeGrid Event parts must be placed within <TimeGrid.Event />.',
    );
  }
  return context;
}
