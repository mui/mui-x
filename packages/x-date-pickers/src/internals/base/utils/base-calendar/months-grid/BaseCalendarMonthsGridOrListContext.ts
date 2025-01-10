import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarMonthsGridOrListContext {
  tabbableMonths: PickerValidDate[];
}

export const BaseCalendarMonthsGridOrListContext = React.createContext<
  BaseCalendarMonthsGridOrListContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarMonthsGridOrListContext.displayName = 'BaseCalendarMonthsGridOrListContext';
}

export function useBaseCalendarMonthsGridOrListContext() {
  const context = React.useContext(BaseCalendarMonthsGridOrListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarMonthsGridOrListContext is missing.',
        '<Calendar.MonthsCell /> must be placed within <Calendar.MonthsList /> or <Calendar.MonthsGrid />.',
        '<RangeCalendar.MonthsCell /> must be placed within <RangeCalendar.MonthsList /> or <RangeCalendar/MonthsGrid />.',
      ].join('\n'),
    );
  }
  return context;
}

export function useNullableBaseCalendarMonthsGridOrListContext() {
  return React.useContext(BaseCalendarMonthsGridOrListContext) ?? null;
}
