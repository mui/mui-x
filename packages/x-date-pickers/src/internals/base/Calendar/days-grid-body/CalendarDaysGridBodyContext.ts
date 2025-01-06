import * as React from 'react';

export interface CalendarDaysGridBodyContext {
  registerWeekRowCells: (
    weekRowRef: React.RefObject<HTMLElement | null>,
    cellsRef: React.RefObject<(HTMLElement | null)[]>,
  ) => () => void;
}

export const CalendarDaysGridBodyContext = React.createContext<
  CalendarDaysGridBodyContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarDaysGridBodyContext.displayName = 'CalendarDaysGridBodyContext';
}

export function useCalendarDaysGridBodyContext() {
  const context = React.useContext(CalendarDaysGridBodyContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarDaysGridBodyContext is missing. Calendar Days Grid parts must be placed within <Calendar.DaysGridBody />.',
    );
  }
  return context;
}
