'use client';
import * as React from 'react';
import { TimelinePremiumStore } from '../use-timeline-premium';

export const TimelinePremiumStoreContext = React.createContext<TimelinePremiumStore<
  any,
  any
> | null>(null);

export function useTimelinePremiumStoreContext<TEvent extends object, TResource extends object>() {
  const context = React.useContext(TimelinePremiumStoreContext);
  if (context == null) {
    throw new Error(
      'useTimelinePremiumStoreContext must be used within an <TimelinePremium /> component',
    );
  }

  return context as TimelinePremiumStore<TEvent, TResource>;
}
