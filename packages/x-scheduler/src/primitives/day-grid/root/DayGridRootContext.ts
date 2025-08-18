'use client';
import * as React from 'react';
import { CalendarPrimitiveEventData } from '../../models';
import { DayGridRootStore } from './store';

export interface DayGridRootContext {
  onEventChange: (data: CalendarPrimitiveEventData) => void;
  setPlaceholder: (placeholder: CalendarPrimitiveEventData | null) => void;
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
