import * as React from 'react';

export interface BaseCalendarDayGridRowContext {
  ref: React.RefObject<HTMLDivElement | null>;
}

export const BaseCalendarDayGridRowContext = React.createContext<
  BaseCalendarDayGridRowContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarDayGridRowContext.displayName = 'BaseCalendarDayGridRowContext';
}

export function useBaseCalendarDayGridRowContext() {
  const context = React.useContext(BaseCalendarDayGridRowContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarDayGridRowContext is missing.',
        '<Calendar.DayGridCell /> must be placed within <Calendar.DayGridRow /> and <RangeCalendar.DayGridCell /> must be placed within <RangeCalendar.DayGridRow />.',
      ].join('\n'),
    );
  }
  return context;
}
