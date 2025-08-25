'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';
import { TimeGridRootStore } from './store';

export interface TimeGridRootContext {
  /**
   * Updates an event.
   * @param {CalendarPrimitiveEventData} data The data describing the updated event.
   */
  updateEvent: (data: CalendarPrimitiveEventData) => void;
  /**
   * Sets the placeholder for the currently dragged event.
   * @param {CalendarPrimitiveEventData | null} placeholder The placeholder data or null to clear it.
   */
  setPlaceholder: (placeholder: CalendarPrimitiveEventData | null) => void;
  /**
   * The store that holds the state of the Time Grid.
   */
  store: TimeGridRootStore;
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
