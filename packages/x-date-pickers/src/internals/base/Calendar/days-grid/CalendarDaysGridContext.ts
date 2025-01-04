import * as React from 'react';
import { PickerValidDate } from '../../../../models';

export interface CalendarDaysGridContext {
  selectDay: (value: PickerValidDate) => void;
  daysGrid: PickerValidDate[][];
}

export const CalendarDaysGridContext = React.createContext<CalendarDaysGridContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  CalendarDaysGridContext.displayName = 'CalendarDaysGridContext';
}

export function useCalendarDaysGridContext() {
  const context = React.useContext(CalendarDaysGridContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarDaysGridContext is missing. Calendar Days Grid parts must be placed withing <Calendar.DaysGrid />.',
    );
  }
  return context;
}
