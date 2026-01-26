'use client';
import * as React from 'react';
import { EventTimelinePremiumStore } from '../use-event-timeline-premium';

export const EventTimelinePremiumStoreContext = React.createContext<EventTimelinePremiumStore<
  any,
  any
> | null>(null);

export function useEventTimelinePremiumStoreContext<
  TEvent extends object,
  TResource extends object,
>() {
  const context = React.useContext(EventTimelinePremiumStoreContext);
  if (context == null) {
    throw new Error(
      'useEventTimelinePremiumStoreContext must be used within an <EventTimelinePremium /> component',
    );
  }

  return context as EventTimelinePremiumStore<TEvent, TResource>;
}
