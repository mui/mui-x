import * as React from 'react';
import { SchedulerValidDate } from '../../utils/adapter/types';

export interface TimeGridColumnContext {
  /**
   * The start date and time of the column
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the column
   */
  end: SchedulerValidDate;
}

export const TimeGridColumnContext = React.createContext<TimeGridColumnContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  TimeGridColumnContext.displayName = 'TimeGridColumnContext';
}

export function useTimeGridColumnContext() {
  const context = React.useContext(TimeGridColumnContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridColumnContext` is missing. <TimeGrid.Event /> must be placed within <TimeGrid.Column />.',
    );
  }
  return context;
}
