import * as React from 'react';
import { PickerValue } from '../../../models';

export interface CalendarRootContext {
  value: PickerValue;
}

export const CalendarRootContext = React.createContext<CalendarRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarRootContext.displayName = 'CalendarRootContext';
}

export function useCalendarRootContext() {
  const context = React.useContext(CalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarRootContext is missing. Calendar parts must be placed within <Calendar.Root />.',
    );
  }
  return context;
}
