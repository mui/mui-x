'use client';
import * as React from 'react';
import { DateCalendar2ContextValue, DateCalendar2PrivateContextValue } from './DateCalendar2.types';
import { useCalendarContext } from '../internals/base/Calendar';

export const DateCalendar2Context = React.createContext<DateCalendar2ContextValue | undefined>(
  undefined,
);

export function useDateCalendar2Context(): useCalendarContext.ReturnValue &
  DateCalendar2ContextValue {
  const baseContext = useCalendarContext();
  const context = React.useContext(DateCalendar2Context);
  if (context === undefined) {
    throw new Error('MUI X: DateCalendar2Context is missing.');
  }
  return React.useMemo(() => ({ ...baseContext, ...context }), [baseContext, context]);
}

export const DateCalendar2PrivateContext = React.createContext<
  DateCalendar2PrivateContextValue | undefined
>(undefined);

export function useDateCalendar2PrivateContext(): DateCalendar2PrivateContextValue {
  const context = React.useContext(DateCalendar2PrivateContext);
  if (context === undefined) {
    throw new Error('MUI X: DateCalendar2PrivateContext is missing.');
  }
  return context;
}
