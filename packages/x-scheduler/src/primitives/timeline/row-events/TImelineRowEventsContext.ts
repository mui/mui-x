'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface TimelineRowEventsContext {
  start: SchedulerValidDate;
  end: SchedulerValidDate;
}

export const TimelineRowEventsContext = React.createContext<TimelineRowEventsContext | undefined>(
  undefined,
);

export function useTimelineRowEventsContext() {
  const context = React.useContext(TimelineRowEventsContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelineRowEventsContext` is missing. <Timeline.Event /> part must be placed within <Timeline.RowEvents />.',
    );
  }
  return context;
}
