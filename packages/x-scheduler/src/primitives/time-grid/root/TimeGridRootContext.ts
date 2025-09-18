'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';

export interface TimeGridRootContext {
  /**
   * Updates an event.
   * @param {CalendarPrimitiveEventData} data The data describing the updated event.
   */
  updateEvent: (data: CalendarPrimitiveEventData) => void;
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
