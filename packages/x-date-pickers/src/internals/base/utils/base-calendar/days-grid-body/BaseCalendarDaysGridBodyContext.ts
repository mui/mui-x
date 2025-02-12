import * as React from 'react';

export interface BaseCalendarDaysGridBodyContext {
  ref: React.RefObject<HTMLDivElement | null>;
}

export const BaseCalendarDaysGridBodyContext = React.createContext<
  BaseCalendarDaysGridBodyContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarDaysGridBodyContext.displayName = 'BaseCalendarDaysGridBodyContext';
}

export function useBaseCalendarDaysGridBodyContext() {
  const context = React.useContext(BaseCalendarDaysGridBodyContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarDaysGridBodyContext is missing.',
        '<Calendar.DaysGridRow /> must be placed within <Calendar.DaysGridBody /> and <RangeCalendar.DaysGridRow /> must be placed within <RangeCalendar.DaysGridBody />.',
      ].join('\n'),
    );
  }
  return context;
}
