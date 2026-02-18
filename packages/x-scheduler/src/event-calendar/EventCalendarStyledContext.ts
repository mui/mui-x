'use client';
import * as React from 'react';
import type { EventCalendarClasses } from './eventCalendarClasses';
import type { EventCalendarLocaleText } from '../models/translations';

export interface EventCalendarStyledContextValue {
  classes: EventCalendarClasses;
  localeText: EventCalendarLocaleText;
}

export const EventCalendarStyledContext =
  React.createContext<EventCalendarStyledContextValue | null>(null);

export function useEventCalendarStyledContext(): EventCalendarStyledContextValue {
  const value = React.useContext(EventCalendarStyledContext);
  if (!value) {
    throw new Error(
      'MUI X: useEventCalendarStyledContext must be used within EventCalendarStyledContext.Provider',
    );
  }
  return value;
}
