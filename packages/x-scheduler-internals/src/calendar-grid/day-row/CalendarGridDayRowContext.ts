'use client';
import * as React from 'react';
import type { TimelineAxis } from '../../internals/utils/timeline-axis';

export interface CalendarGridDayRowContext {
  /**
   * The axis of the row: its first and last instants, read in the display timezone.
   */
  axis: TimelineAxis;
  /**
   * The index of this row within its row type.
   * Always 0 for views with a single day row (week/day view).
   * In month view, this is the week index (0–5).
   */
  rowIndex: number;
  /**
   * Returns the date of each cell of the row, as a day number, in the order of the cells.
   * A row can skip dates (hidden weekends, days a timezone skips), so its cells are not every date
   * between its start and its end.
   */
  getCellDayNumbers: () => number[];
  /**
   * Registers the date of the `index`-th cell of the row, as a day number.
   * Returns a function that unregisters it.
   */
  registerCellDayNumber: (index: number, dayNumber: number) => () => void;
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
