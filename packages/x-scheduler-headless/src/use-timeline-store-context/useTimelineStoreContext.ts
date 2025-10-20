'use client';
import * as React from 'react';
import { TimelineStore } from '../use-timeline';

export const TimelineStoreContext = React.createContext<TimelineStore | null>(null);

export function useTimelineStoreContext() {
  const context = React.useContext(TimelineStoreContext);
  if (context == null) {
    throw new Error('useTimelineStoreContext must be used within an <Timeline /> component');
  }

  return context;
}
