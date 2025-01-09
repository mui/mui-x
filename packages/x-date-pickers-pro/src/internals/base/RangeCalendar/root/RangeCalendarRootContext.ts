import * as React from 'react';
import { PickerRangeValue } from '@mui/x-date-pickers/internals';

export interface RangeCalendarRootContext {
  value: PickerRangeValue;
}

export const RangeCalendarRootContext = React.createContext<RangeCalendarRootContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  RangeCalendarRootContext.displayName = 'RangeCalendarRootContext';
}

export function useCalendarRootContext() {
  const context = React.useContext(RangeCalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: RangeCalendarRootContext is missing. Range Calendar parts must be placed within <RangeCalendar.Root />.',
    );
  }
  return context;
}
