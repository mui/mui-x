'use client';
import * as React from 'react';
import { EventCalendarStore } from '../use-event-calendar';

export const EventCalendarStoreContext = React.createContext<EventCalendarStore<any, any> | null>(
  null,
);

export function useEventCalendarStoreContext<TEvent extends object, TResource extends object>() {
  const context = React.useContext(EventCalendarStoreContext);
  if (context == null) {
    throw new Error(
      'MUI: useEventCalendarStoreContext must be used within an <EventCalendar /> component',
    );
  }

  return context as EventCalendarStore<TEvent, TResource>;
}
