'use client';
import * as React from 'react';
import type { EventCalendarClasses } from './eventCalendarClasses';

export const EventCalendarClassesContext = React.createContext<EventCalendarClasses | null>(null);

export function useEventCalendarClasses(): EventCalendarClasses {
  const classes = React.useContext(EventCalendarClassesContext);
  if (!classes) {
    throw new Error(
      'useEventCalendarClasses must be used within EventCalendarClassesContext.Provider',
    );
  }
  return classes;
}
