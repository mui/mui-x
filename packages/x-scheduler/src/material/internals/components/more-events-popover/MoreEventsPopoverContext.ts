'use client';
import * as React from 'react';
import { MoreEventsPopoverContextValue } from './MoreEventsPopover.types';

export const MoreEventsPopoverContext = React.createContext<MoreEventsPopoverContextValue>({
  showEvents: () => {},
});

export function useMoreEventsPopoverContext(): MoreEventsPopoverContextValue {
  const context = React.useContext(MoreEventsPopoverContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `MoreEventsPopoverContext` is missing. useMoreEventsPopoverContext() must be placed within <MoreEventsPopoverProvider />..',
    );
  }
  return context;
}
