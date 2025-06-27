'use client';
import * as React from 'react';
import { Store } from '../../../base-ui-copy/utils/store';
import { State } from '../../event-calendar/store';

export const EventCalendarStoreContext = React.createContext<Store<State> | null>(null);

export function useEventCalendarStore() {
  const context = React.useContext(EventCalendarStoreContext);
  if (context == null) {
    throw new Error('useEventCalendarStore must be used within an <EventCalendar /> component');
  }

  return context;
}
