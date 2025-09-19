'use client';
import * as React from 'react';

export interface DayGridRootContext {
  /**
   * A unique id identifying this day grid instance.
   */
  id: string | undefined;
}

export const DayGridRootContext = React.createContext<DayGridRootContext | undefined>(undefined);

export function useDayGridRootContext() {
  const context = React.useContext(DayGridRootContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `DayGridRootContext` is missing. Day Grid parts must be placed within <DayGrid.Root />.',
    );
  }
  return context;
}
