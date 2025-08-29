'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface DayGridRowContext {
  /**
   * The start date and time of the column
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the column
   */
  end: SchedulerValidDate;
}

export const DayGridRowContext = React.createContext<DayGridRowContext | undefined>(undefined);

export function useDayGridRowContext() {
  const context = React.useContext(DayGridRowContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `DayGridRowContext` is missing. <DayGrid.Event /> must be placed within <DayGrid.Row />.',
    );
  }
  return context;
}
