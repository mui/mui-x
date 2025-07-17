'use client';
import * as React from 'react';
import { TemporalValidDate } from '../../models';

export interface TimeGridColumnContext {
  /**
   * The start date and time of the column
   */
  start: TemporalValidDate;
  /**
   * The end date and time of the column
   */
  end: TemporalValidDate;
}

export const TimeGridColumnContext = React.createContext<TimeGridColumnContext | undefined>(
  undefined,
);

export function useTimeGridColumnContext() {
  const context = React.useContext(TimeGridColumnContext);
  if (context === undefined) {
    throw new Error(
      'Time Grid Primitive: `TimeGridColumnContext` is missing. <TimeGrid.Event /> must be placed within <TimeGrid.Column />.',
    );
  }
  return context;
}
