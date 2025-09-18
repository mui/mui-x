'use client';
import * as React from 'react';
import { CalendarDraggedOccurrence } from '../../models';

export interface DayGridRootContext {
  /**
   * Callback fired when an occurrence is dropped inside the day grid.
   * @param {CalendarDraggedOccurrence} data The data describing the dropped occurrence.
   */
  dropOccurrence: (data: CalendarDraggedOccurrence) => void;
  /**
   * A unique id identifying this day grid instance.
   */
  id: string | undefined;
}

export const DayGridRootContext = React.createContext<DayGridRootContext | undefined>(undefined);

export function useDayGridRootContext() {
  const context = React.useContext(DayGridRootContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `DayGridRootContext` is missing. Day Grid parts must be placed within <DayGrid.Root />.',
    );
  }
  return context;
}
