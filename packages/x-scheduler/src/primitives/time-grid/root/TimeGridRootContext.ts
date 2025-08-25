'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';
import { TimeGridRootStore } from './store';

export interface TimeGridRootContext {
  onEventChange: (data: CalendarPrimitiveEventData) => void;
  setPlaceholder: (placeholder: CalendarPrimitiveEventData | null) => void;
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
