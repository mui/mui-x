'use client';
import * as React from 'react';

export interface CalendarGridDayCellContext {}

export const CalendarGridDayCellContext = React.createContext<
  CalendarGridDayCellContext | undefined
>(undefined);

export function useCalendarGridDayCellContext() {
  const context = React.useContext(CalendarGridDayCellContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `CalendarGridDayCellContext` is missing. <CalendarGrid.DayEvent /> must be placed within <CalendarGrid.DayCell />.',
    );
  }
  return context;
}
