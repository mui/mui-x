import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarRootVisibleDateContext {
  /**
   * The date currently visible.
   * It is used to determine:
   * - which month to render in Calendar.DaysGrid and RangeCalendar.DaysGrid
   * - which year to render in Calendar.YearsGrid, Calendar.YearsList, RangeCalendar.YearsGrid, and RangeCalendar.YearsList
   */
  visibleDate: PickerValidDate;
}

export const BaseCalendarRootVisibleDateContext = React.createContext<
  BaseCalendarRootVisibleDateContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarRootVisibleDateContext.displayName = 'BaseCalendarRootVisibleDateContext';
}

export function useBaseCalendarRootVisibleDateContext() {
  const context = React.useContext(BaseCalendarRootVisibleDateContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarRootVisibleDateContext is missing.',
        'Calendar parts must be placed within <Calendar.Root /> and Range Calendar parts must be placed within <RangeCalendar.Root />.',
      ].join('\n'),
    );
  }
  return context;
}
