'use client';
import * as React from 'react';

export interface CalendarGridRootContext {
  /**
   * The id of the grid (used for accessibility purposes).
   */
  id: string | undefined;
}

export const CalendarGridRootContext = React.createContext<CalendarGridRootContext | undefined>(
  undefined,
);

export function useCalendarGridRootContext() {
  const context = React.useContext(CalendarGridRootContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `CalendarGridRootContext` is missing. CalendarGrid parts must be placed within <CalendarGrid.Root />.',
    );
  }
  return context;
}
