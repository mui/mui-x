import * as React from 'react';
import { PickerValidDate } from '../../../../models';

export interface CalendarYearsListContext {
  selectYear: (value: PickerValidDate) => void;
}

export const CalendarYearsListContext = React.createContext<CalendarYearsListContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  CalendarYearsListContext.displayName = 'CalendarYearsListContext';
}

export function useCalendarYearsListContext() {
  const context = React.useContext(CalendarYearsListContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarYearsListContext is missing. Calendar Year List parts must be placed within <Calendar.YearList />.',
    );
  }
  return context;
}
