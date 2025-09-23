'use client';
import * as React from 'react';
import { EventPopoverContextValue } from './EventPopover.types';

export const EventPopoverContext = React.createContext<EventPopoverContextValue>({
  startEditing: () => {},
});

export function useEventPopover(): EventPopoverContextValue {
  const context = React.useContext(EventPopoverContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `EventPopoverContext` is missing. Wrap your tree with <EventPopoverProvider>.',
    );
  }
  return context;
}
