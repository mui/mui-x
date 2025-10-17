'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface TimelineEventRowContext {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
}

export const TimelineEventRowContext = React.createContext<TimelineEventRowContext | undefined>(
  undefined,
);

export function useTimelineEventRowContext() {
  const context = React.useContext(TimelineEventRowContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelineEventRowContext` is missing. <Timeline.Event /> part must be placed within <Timeline.EventRow />.',
    );
  }
  return context;
}
