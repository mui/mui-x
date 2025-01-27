import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarYearsGridOrListContext {
  tabbableYears: PickerValidDate[];
}

export const BaseCalendarYearsGridOrListContext = React.createContext<
  BaseCalendarYearsGridOrListContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarYearsGridOrListContext.displayName = 'BaseCalendarYearsGridOrListContext';
}

export function useBaseCalendarYearsGridOrListContext() {
  const context = React.useContext(BaseCalendarYearsGridOrListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarYearsGridOrListContext is missing.',
        '<Calendar.YearsCell /> must be placed within <Calendar.YearsList /> or <Calendar.YearsGrid />.',
        '<RangeCalendar.YearsCell /> must be placed within <RangeCalendar.YearsList /> or <RangeCalendar/YearsGrid />.',
      ].join('\n'),
    );
  }
  return context;
}

export function useNullableBaseCalendarYearsGridOrListContext() {
  return React.useContext(BaseCalendarYearsGridOrListContext) ?? null;
}
