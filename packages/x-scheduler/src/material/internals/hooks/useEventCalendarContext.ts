'use client';
import * as React from 'react';
import { Store } from '@base-ui-components/utils/store';
import { State } from '../../event-calendar/store';
import { EventCalendarInstance } from '../../event-calendar/EventCalendar.types';

export const EventCalendarContext = React.createContext<{
  store: Store<State>;
  instance: EventCalendarInstance;
} | null>(null);

export function useEventCalendarContext() {
  const context = React.useContext(EventCalendarContext);
  if (context == null) {
    throw new Error('useEventCalendarContext must be used within an <EventCalendar /> component');
  }

  return context;
}
