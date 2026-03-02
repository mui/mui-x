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
      'MUI X Scheduler: useEventCalendarStyledContext must be used within an EventCalendarStyledContext.Provider. ' +
        'The component requires access to calendar styling and locale information. ' +
        'Ensure the component is rendered inside an EventCalendar component.',
    );
  }
  return value;
}
