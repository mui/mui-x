import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarDaysGridContext {
  selectDay: (value: PickerValidDate) => void;
  currentMonth: PickerValidDate;
  tabbableDay: PickerValidDate | null;
  daysGrid: PickerValidDate[][];
}

export const BaseCalendarDaysGridContext = React.createContext<
  BaseCalendarDaysGridContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarDaysGridContext.displayName = 'BaseCalendarDaysGridContext';
}

export function useBaseCalendarDaysGridContext() {
  const context = React.useContext(BaseCalendarDaysGridContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarDaysGridContext is missing.',
        '<Calendar.DaysGridBody /> must be placed within <Calendar.DaysGrid /> and <RangeCalendar.DaysGridBody /> must be placed within <RangeCalendar.DaysGrid />.',
      ].join('\n'),
    );
  }
  return context;
}
