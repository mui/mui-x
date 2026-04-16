'use client';
import * as React from 'react';

export interface CalendarGridDayCellContext {
  /**
   * The index of the cell in the row.
   */
  index: number;
  /**
   * Whether this cell currently has keyboard focus.
   * When `true`, interactive children (e.g. events) should use `tabIndex={0}`
   * so they are reachable via Tab. When `false`, they should use `tabIndex={-1}`.
   */
  hasFocus: boolean;
}

export const CalendarGridDayCellContext = React.createContext<
  CalendarGridDayCellContext | undefined
>(undefined);

export function useCalendarGridDayCellContext() {
  const context = React.useContext(CalendarGridDayCellContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `CalendarGridDayCellContext` is missing. <CalendarGrid.DayEvent /> must be placed within <CalendarGrid.DayCell />.',
    );
  }
  return context;
}
