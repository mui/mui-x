import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface CalendarDayGridBodyContext {
  /**
   * The month of this component.
   */
  month: PickerValidDate;
  /**
   * Return true if the day should be reachable using tab navigation.
   * @param {PickerValidDate} day The day to check.
   * @returns {boolean} Whether the day should be reachable using tab navigation.
   */
  canCellBeTabbed: (day: PickerValidDate) => boolean;
  /**
   * The days grid to render inside this component.
   */
  daysGrid: PickerValidDate[][];
  /**
   * The DOM ref of the DayGridBody primitive.
   */
  ref: React.RefObject<HTMLDivElement | null>;
}

export const CalendarDayGridBodyContext = React.createContext<
  CalendarDayGridBodyContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarDayGridBodyContext.displayName = 'CalendarDayGridBodyContext';
}

export function useCalendarDayGridBodyContext() {
  const context = React.useContext(CalendarDayGridBodyContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: CalendarDayGridBodyContext is missing.',
        '<Calendar.DayGridRow /> must be placed within <Calendar.DayGridBody /> and <RangeCalendar.DayGridRow /> must be placed within <RangeCalendar.DayGridBody />.',
      ].join('\n'),
    );
  }
  return context;
}
