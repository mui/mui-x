'use client';
import * as React from 'react';
import { SchedulerParameters, SchedulerState, SchedulerStore } from './SchedulerStore';

export const SchedulerStoreContext = React.createContext<Omit<
  SchedulerStore<SchedulerState, SchedulerParameters>,
  'updateStateFromParameters' | 'disposeEffect' | 'update'
> | null>(null);

export function useSchedulerStoreContext() {
  const context = React.useContext(SchedulerStoreContext);
  if (context == null) {
    throw new Error(
      'useSchedulerStoreContext must be used within an <EventCalendar /> or a <Timeline /> component',
    );
  }

  return context;
}
