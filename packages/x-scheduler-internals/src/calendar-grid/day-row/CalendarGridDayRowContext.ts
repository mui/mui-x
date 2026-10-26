'use client';
import * as React from 'react';
import type { TimelineAxis } from '../../internals/utils/timeline-axis';

export interface CalendarGridDayRowContext {
  /**
   * The first instant of the row, as a timestamp read in the display timezone.
   */
  start: number;
  /**
   * The last instant of the row, as a timestamp read in the display timezone.
   */
  end: number;
  /**
   * The axis the events of the row are positioned on.
   */
  axis: TimelineAxis;
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
