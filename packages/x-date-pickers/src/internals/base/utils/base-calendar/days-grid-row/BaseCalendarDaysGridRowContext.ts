import * as React from 'react';

export interface BaseCalendarDaysGridRowContext {
  ref: React.RefObject<HTMLDivElement | null>;
}

export const BaseCalendarDaysGridRowContext = React.createContext<
  BaseCalendarDaysGridRowContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarDaysGridRowContext.displayName = 'BaseCalendarDaysGridRowContext';
}

export function useBaseCalendarDaysGridRowContext() {
  const context = React.useContext(BaseCalendarDaysGridRowContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarDaysGridRowContext is missing.',
        '<Calendar.DaysGridCell /> must be placed within <Calendar.DaysGridRow /> and <RangeCalendar.DaysGridCell /> must be placed within <RangeCalendar.DaysGridRow />.',
      ].join('\n'),
    );
  }
  return context;
}
