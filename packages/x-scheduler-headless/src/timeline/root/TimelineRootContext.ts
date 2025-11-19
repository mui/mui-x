'use client';
import * as React from 'react';
import { TimelineRootStore } from './store';

export interface TimelineRootContext<Item = any> {
  store: TimelineRootStore<Item>;
}

export const TimelineRootContext = React.createContext<TimelineRootContext | undefined>(undefined);

export function useTimelineRootContext<Item = any>() {
  const context = React.useContext(TimelineRootContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelineRootContext` is missing. Timeline parts must be placed within <Timeline.Root />.',
    );
  }
  return context as TimelineRootContext<Item>;
}
