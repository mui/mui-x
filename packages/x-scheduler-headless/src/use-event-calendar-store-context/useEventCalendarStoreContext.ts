'use client';
import * as React from 'react';
import { EventCalendarStore } from '../use-event-calendar';

export const EventCalendarStoreContext = React.createContext<EventCalendarStore<any> | null>(null);

export function useEventCalendarStoreContext<TModel extends {}>() {
  const context = React.useContext(EventCalendarStoreContext);
  if (context == null) {
    throw new Error(
      'useEventCalendarStoreContext must be used within an <EventCalendar /> component',
    );
  }

  return context as EventCalendarStore<TModel>;
}
