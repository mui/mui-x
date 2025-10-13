'use client';
import * as React from 'react';
import { SchedulerParameters, SchedulerState, SchedulerStore } from '../utils/SchedulerStore';

// TODO: Use Remove `update: any` for the update method once `useStore` uses `ReadonlyStore`
export interface SchedulerStoreInContext<TEvent extends object, TResource extends object>
  extends SchedulerStore<any, any, SchedulerState, SchedulerParameters<TEvent, TResource>> {
  update: any;
}

export const SchedulerStoreContext = React.createContext<SchedulerStoreInContext<any, any> | null>(
  null,
);

export function useSchedulerStoreContext<TEvent extends object, TResource extends object>() {
  const context = React.useContext(SchedulerStoreContext);
  if (context == null) {
    throw new Error(
      'useSchedulerStoreContext must be used within an <EventCalendar /> or a <Timeline /> component',
    );
  }

  return context as SchedulerStoreInContext<TEvent, TResource>;
}
