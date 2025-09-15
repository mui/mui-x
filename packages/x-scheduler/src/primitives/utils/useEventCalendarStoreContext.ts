'use client';
import * as React from 'react';
import { EventCalendarStore } from '../use-event-calendar';

export const EventCalendarStoreContext = React.createContext<EventCalendarStore | null>(null);

export function useEventCalendarStoreContext() {
  const context = React.useContext(EventCalendarStoreContext);
  if (context == null) {
    throw new Error(
      'useEventCalendarStoreContext must be used within an <EventCalendar /> component',
    );
  }

  return context;
}
