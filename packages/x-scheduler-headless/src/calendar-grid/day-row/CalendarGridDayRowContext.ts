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
}

export const CalendarGridDayRowContext = React.createContext<CalendarGridDayRowContext | undefined>(
  undefined,
);

export function useCalendarGridDayRowContext() {
  const context = React.useContext(CalendarGridDayRowContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `CalendarGridDayRowContext` is missing. <CalendarGrid.DayEvent /> must be placed within <CalendarGrid.DayRow />.',
    );
  }
  return context;
}
