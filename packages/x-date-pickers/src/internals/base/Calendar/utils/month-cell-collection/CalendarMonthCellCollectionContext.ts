import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface CalendarMonthCellCollectionContext {
  selectMonth: (value: PickerValidDate) => void;
}

export const CalendarMonthCellCollectionContext = React.createContext<
  CalendarMonthCellCollectionContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarMonthCellCollectionContext.displayName = 'CalendarMonthCellCollectionContext';
}

export function useCalendarMonthCellCollectionContext() {
  const context = React.useContext(CalendarMonthCellCollectionContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarMonthCellCollectionContext is missing. Calendar Month parts must be placed within <Calendar.MonthList /> or `<Calendar.MonthGrid />`.',
    );
  }
  return context;
}
