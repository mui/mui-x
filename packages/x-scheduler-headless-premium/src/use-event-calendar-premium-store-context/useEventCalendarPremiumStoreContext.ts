'use client';
import * as React from 'react';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium';

export const EventCalendarPremiumStoreContext = React.createContext<EventCalendarPremiumStore<
  any,
  any
> | null>(null);

export function useEventCalendarPremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const context = React.useContext(EventCalendarPremiumStoreContext);
  if (context == null) {
    throw new Error(
      'MUI: useEventCalendarPremiumStoreContext must be used within an <EventCalendarPremium /> component',
    );
  }

  return context as EventCalendarPremiumStore<TEvent, TResource>;
}
