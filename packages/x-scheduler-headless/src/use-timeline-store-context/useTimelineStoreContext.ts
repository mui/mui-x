'use client';
import * as React from 'react';
import { TimelineStore } from '../use-timeline';

export const TimelineStoreContext = React.createContext<TimelineStore<any> | null>(null);

export function useTimelineStoreContext<TModel extends {}>() {
  const context = React.useContext(TimelineStoreContext);
  if (context == null) {
    throw new Error('useTimelineStoreContext must be used within an <Timeline /> component');
  }

  return context as TimelineStore<TModel>;
}
