'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';
import { DayGridRootStore } from './store';

export interface DayGridRootContext {
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
   * The store that holds the state of the Day Grid.
   */
  store: DayGridRootStore;
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
