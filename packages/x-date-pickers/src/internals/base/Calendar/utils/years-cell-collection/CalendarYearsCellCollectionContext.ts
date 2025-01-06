import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface CalendarYearsCellCollectionContext {
  selectYear: (value: PickerValidDate) => void;
}

export const CalendarYearsCellCollectionContext = React.createContext<
  CalendarYearsCellCollectionContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarYearsCellCollectionContext.displayName = 'CalendarYearsCellCollectionContext';
}

export function useCalendarYearsCellCollectionContext() {
  const context = React.useContext(CalendarYearsCellCollectionContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarYearsCellCollectionContext is missing. Calendar Year parts must be placed within <Calendar.YearsList /> or `<Calendar.YearsGrid />`.',
    );
  }
  return context;
}
