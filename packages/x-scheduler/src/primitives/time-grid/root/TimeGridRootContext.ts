'use client';
import * as React from 'react';
import type { TimeGridRoot } from './TimeGridRoot';

export interface TimeGridRootContext {
  onEventChange: (data: TimeGridRoot.EventData) => void;
  placeholder: TimeGridRoot.PlaceholderData | null;
  setPlaceholder: (placeholder: TimeGridRoot.PlaceholderData | null) => void;
}

export const TimeGridRootContext = React.createContext<TimeGridRootContext | undefined>(undefined);

export function useTimeGridRootContext() {
  const context = React.useContext(TimeGridRootContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridRootContext` is missing. Time Grid parts must be placed within <TimeGrid.Root />.',
    );
  }
  return context;
}
