'use client';
import * as React from 'react';
import type { useEventCalendar, EventCalendarStore } from '../../../primitives/use-event-calendar';

export const EventCalendarContext = React.createContext<{
  store: EventCalendarStore;
  instance: useEventCalendar.Instance;
} | null>(null);

export function useEventCalendarContext() {
  const context = React.useContext(EventCalendarContext);
  if (context == null) {
    throw new Error('useEventCalendarContext must be used within an <EventCalendar /> component');
  }

  return context;
}
