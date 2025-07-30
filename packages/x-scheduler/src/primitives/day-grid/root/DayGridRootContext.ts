'use client';
import * as React from 'react';
import { EventData } from '../../models';
import { DayGridRootStore } from './store';

export interface DayGridRootContext {
  onEventChange: (data: EventData) => void;
  setPlaceholder: (placeholder: EventData | null) => void;
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
