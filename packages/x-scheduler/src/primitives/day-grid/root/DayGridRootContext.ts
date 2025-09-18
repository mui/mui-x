'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';

export interface DayGridRootContext {
  /**
   * Updates an event.
   * @param {CalendarPrimitiveEventData} data The data describing the updated event.
   */
  updateEvent: (data: CalendarPrimitiveEventData) => void;
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
