'use client';
import * as React from 'react';
import type { Virtualizer } from '@mui/x-virtualizer';

export const EventTimelinePremiumVirtualizerContext = React.createContext<
  Virtualizer['store'] | null
>(null);

export function useEventTimelinePremiumVirtualizerStore(): Virtualizer['store'] {
  const store = React.useContext(EventTimelinePremiumVirtualizerContext);
  if (!store) {
    throw new Error(
      'MUI X Scheduler: EventTimelinePremiumVirtualizerContext is missing. ' +
        'Make sure the calling component is rendered inside <EventTimelinePremiumContent />.',
    );
  }
  return store;
}
