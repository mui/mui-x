import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface CalendarMonthsCellCollectionContext {
  selectMonth: (value: PickerValidDate) => void;
}

export const CalendarMonthsCellCollectionContext = React.createContext<
  CalendarMonthsCellCollectionContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarMonthsCellCollectionContext.displayName = 'CalendarMonthsCellCollectionContext';
}

export function useCalendarMonthsCellCollectionContext() {
  const context = React.useContext(CalendarMonthsCellCollectionContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarMonthsCellCollectionContext is missing. Calendar Month parts must be placed within <Calendar.MonthsList /> or `<Calendar.MonthsGrid />`.',
    );
  }
  return context;
}
