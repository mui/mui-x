'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface TimeGridEventContext {
  /**
   * The unique identifier of the event.
   */
  eventId: string | number;
  /**
   * The start date and time of the event
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the event
   */
  end: SchedulerValidDate;
  /**
   * Sets whether the event is being resized.
   */
  setIsResizing: (isResizing: boolean) => void;
}

export const TimeGridEventContext = React.createContext<TimeGridEventContext | undefined>(
  undefined,
);

export function useTimeGridEventContext() {
  const context = React.useContext(TimeGridEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridEventContext` is missing. TimeGrid Event parts must be placed within <TimeGrid.Event />.',
    );
  }
  return context;
}
