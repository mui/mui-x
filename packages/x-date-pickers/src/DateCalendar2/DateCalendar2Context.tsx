'use client';
import * as React from 'react';
import { DateCalendar2Classes } from './DateCalendar2.classes';

export const DateCalendar2Context = React.createContext<
  { classes: DateCalendar2Classes } | undefined
>(undefined);

export function useDateCalendar2Context() {
  const context = React.useContext(DateCalendar2Context);
  if (context === undefined) {
    throw new Error('MUI X: DateCalendar2Context is missing.');
  }
  return context;
}
