import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarMonthGridOrListContext {
  tabbableMonths: PickerValidDate[];
}

export const BaseCalendarMonthGridOrListContext = React.createContext<
  BaseCalendarMonthGridOrListContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarMonthGridOrListContext.displayName = 'BaseCalendarMonthGridOrListContext';
}

export function useBaseCalendarMonthGridOrListContext() {
  const context = React.useContext(BaseCalendarMonthGridOrListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarMonthGridOrListContext is missing.',
        '<Calendar.MonthCell /> must be placed within <Calendar.MonthList /> or <Calendar.MonthGrid />.',
        '<RangeCalendar.MonthCell /> must be placed within <RangeCalendar.MonthList /> or <RangeCalendar/MonthGrid />.',
      ].join('\n'),
    );
  }
  return context;
}

export function useNullableBaseCalendarMonthGridOrListContext() {
  return React.useContext(BaseCalendarMonthGridOrListContext) ?? null;
}
