import * as React from 'react';
import { useCalendarState } from './hooks/useCalendarState';

export const CalendarContext = React.createContext<ReturnType<typeof useCalendarState> | undefined>(
  undefined,
);

export function useCalendarContext() {
  const context = React.useContext(CalendarContext);

  if (context === undefined) {
    throw new Error('Missing context');
  }

  return context;
}
