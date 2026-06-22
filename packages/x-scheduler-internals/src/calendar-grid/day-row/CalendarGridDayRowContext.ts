'use client';
import * as React from 'react';
import { TemporalSupportedObject } from '../../models';

export interface CalendarGridDayRowContext {
  /**
   * The start date and time of the row
   */
  start: TemporalSupportedObject;
  /**
   * The end date and time of the row
   */
  end: TemporalSupportedObject;
  /**
   * The index of this row within its row type.
   * Always 0 for views with a single day row (week/day view).
   * In month view, this is the week index (0–5).
   */
  rowIndex: number;
}

export const CalendarGridDayRowContext = React.createContext<CalendarGridDayRowContext | undefined>(
  undefined,
);

export function useCalendarGridDayRowContext() {
  const context = React.useContext(CalendarGridDayRowContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: CalendarGridDayRowContext is missing. ' +
        '<CalendarGrid.DayCell /> and <CalendarGrid.DayEvent /> must be placed within <CalendarGrid.DayRow />. ' +
        'Ensure the component hierarchy is correct.',
    );
  }
  return context;
}
