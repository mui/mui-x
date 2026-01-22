'use client';
import * as React from 'react';
import { TimelineStore } from '../use-timeline';

export const TimelineStoreContext = React.createContext<TimelineStore<any, any> | null>(null);

export function useTimelineStoreContext<TEvent extends object, TResource extends object>() {
  const context = React.useContext(TimelineStoreContext);
  if (context == null) {
    throw new Error('useTimelineStoreContext must be used within an <Timeline /> component');
  }

  return context as TimelineStore<TEvent, TResource>;
}
