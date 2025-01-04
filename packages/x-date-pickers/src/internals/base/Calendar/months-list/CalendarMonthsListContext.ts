import * as React from 'react';
import { PickerValidDate } from '../../../../models';

export interface CalendarMonthsListContext {
  selectMonth: (value: PickerValidDate) => void;
}

export const CalendarMonthsListContext = React.createContext<CalendarMonthsListContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  CalendarMonthsListContext.displayName = 'CalendarMonthsListContext';
}

export function useCalendarMonthsListContext() {
  const context = React.useContext(CalendarMonthsListContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarMonthsListContext is missing. Calendar Month List parts must be placed withing <Calendar.MonthList />.',
    );
  }
  return context;
}
