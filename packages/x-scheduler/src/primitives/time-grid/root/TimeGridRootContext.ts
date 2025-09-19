'use client';
import * as React from 'react';

export interface TimeGridRootContext {
  /**
   * A unique id identifying this time grid instance.
   */
  id: string | undefined;
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
