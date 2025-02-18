import * as React from 'react';
import { PickerValidDate } from '../../../../../models';

export interface BaseCalendarDayGridBodyContext {
  currentMonth: PickerValidDate;
  tabbableDays: PickerValidDate[];
  daysGrid: PickerValidDate[][];
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
