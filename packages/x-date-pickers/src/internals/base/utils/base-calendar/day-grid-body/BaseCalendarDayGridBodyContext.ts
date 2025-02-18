import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarDayGridBodyContext {
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

export const BaseCalendarDayGridBodyContext = React.createContext<
  BaseCalendarDayGridBodyContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarDayGridBodyContext.displayName = 'BaseCalendarDayGridBodyContext';
}

export function useBaseCalendarDayGridBodyContext() {
  const context = React.useContext(BaseCalendarDayGridBodyContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarDayGridBodyContext is missing.',
        '<Calendar.DayGridRow /> must be placed within <Calendar.DayGridBody /> and <RangeCalendar.DayGridRow /> must be placed within <RangeCalendar.DayGridBody />.',
      ].join('\n'),
    );
  }
  return context;
}
