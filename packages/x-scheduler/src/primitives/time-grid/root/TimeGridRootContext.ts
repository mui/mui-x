'use client';
import * as React from 'react';
import { CalendarDraggedOccurrence } from '../../models';

export interface TimeGridRootContext {
  /**
   * Callback fired when an occurrence is dropped inside the time grid.
   * @param {CalendarDraggedOccurrence} data The data describing the dropped occurrence.
   */
  dropOccurrence: (data: CalendarDraggedOccurrence) => void;
  /**
   * A unique id identifying this time grid instance.
   */
  id: string | undefined;
}

export const TimeGridRootContext = React.createContext<TimeGridRootContext | undefined>(undefined);

export function useTimeGridRootContext() {
  const context = React.useContext(TimeGridRootContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridRootContext` is missing. Time Grid parts must be placed within <TimeGrid.Root />.',
    );
  }
  return context;
}
