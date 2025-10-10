'use client';
import * as React from 'react';
import { SchedulerParameters, SchedulerState, SchedulerStore } from '../utils/SchedulerStore';

// TODO: Use Remove `update: any` for the update method once `useStore` uses `ReadonlyStore`
export interface SchedulerStoreInContext<TModel extends {}>
  extends SchedulerStore<any, SchedulerState, SchedulerParameters<TModel>> {
  update: any;
}

export const SchedulerStoreContext = React.createContext<SchedulerStoreInContext<any> | null>(null);

export function useSchedulerStoreContext<TModel extends {}>() {
  const context = React.useContext(SchedulerStoreContext);
  if (context == null) {
    throw new Error(
      'useSchedulerStoreContext must be used within an <EventCalendar /> or a <Timeline /> component',
    );
  }

  return context as SchedulerStoreInContext<TModel>;
}
