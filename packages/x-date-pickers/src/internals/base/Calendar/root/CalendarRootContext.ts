import * as React from 'react';
import { PickerValidDate } from '../../../../models';

export interface CalendarRootContext {
  value: PickerValidDate | null;
  selectMonth: (value: PickerValidDate) => void;
  referenceDate: PickerValidDate;
}

export const CalendarRootContext = React.createContext<CalendarRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarRootContext.displayName = 'CalendarRootContext';
}

export function useCalendarRootContext() {
  const context = React.useContext(CalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarRootContext is missing. Calendar parts must be placed withing <Calendar.Root />.',
    );
  }
  return context;
}
