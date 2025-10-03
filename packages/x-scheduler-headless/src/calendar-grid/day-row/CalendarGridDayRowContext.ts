'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface CalendarGridDayRowContext {
  /**
   * The start date and time of the row
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the row
   */
  end: SchedulerValidDate;
}

export const CalendarGridDayRowContext = React.createContext<CalendarGridDayRowContext | undefined>(
  undefined,
);

export function useCalendarGridDayRowContext() {
  const context = React.useContext(CalendarGridDayRowContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `CalendarGridDayRowContext` is missing. <CalendarGrid.DayEvent /> must be placed within <CalendarGrid.DayRow />.',
    );
  }
  return context;
}
