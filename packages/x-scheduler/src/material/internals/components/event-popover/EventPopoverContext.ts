'use client';
import * as React from 'react';
import { EventPopoverContextValue } from './EventPopover.types';

export const EventPopoverContext = React.createContext<EventPopoverContextValue>({
  startEditing: () => {},
});

export function useEventPopoverContext(): EventPopoverContextValue {
  const context = React.useContext(EventPopoverContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `EventPopoverContext` is missing. useEventPopoverContext() must be placed within <EventPopoverProvider />..',
    );
  }
  return context;
}
