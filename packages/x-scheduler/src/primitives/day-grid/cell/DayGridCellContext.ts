'use client';
import * as React from 'react';

export interface DayGridCellContext {}

export const DayGridCellContext = React.createContext<DayGridCellContext | undefined>(undefined);

export function useDayGridCellContext() {
  const context = React.useContext(DayGridCellContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `DayGridCellContext` is missing. <DayGrid.Event /> must be placed within <DayGrid.Cell />.',
    );
  }
  return context;
}
