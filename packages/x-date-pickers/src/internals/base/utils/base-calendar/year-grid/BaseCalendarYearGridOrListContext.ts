import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarYearGridOrListContext {
  tabbableYears: PickerValidDate[];
}

export const BaseCalendarYearGridOrListContext = React.createContext<
  BaseCalendarYearGridOrListContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarYearGridOrListContext.displayName = 'BaseCalendarYearGridOrListContext';
}

export function useBaseCalendarYearGridOrListContext() {
  const context = React.useContext(BaseCalendarYearGridOrListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarYearGridOrListContext is missing.',
        '<Calendar.YearCell /> must be placed within <Calendar.YearList /> or <Calendar.YearGrid />.',
        '<RangeCalendar.YearCell /> must be placed within <RangeCalendar.YearList /> or <RangeCalendar/YearGrid />.',
      ].join('\n'),
    );
  }
  return context;
}

export function useNullableBaseCalendarYearGridOrListContext() {
  return React.useContext(BaseCalendarYearGridOrListContext) ?? null;
}
