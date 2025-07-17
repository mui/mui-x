'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';
import type { TimeGridRoot } from '../root';

export interface TimeGridColumnPlaceholderContext {
  /**
   * The placeholder to render in the column.
   */
  placeholder: TimeGridRoot.EventData | null;
}

export const TimeGridColumnPlaceholderContext = React.createContext<
  TimeGridColumnPlaceholderContext | undefined
>(undefined);

export function useTimeGridColumnPlaceholderContext() {
  const context = React.useContext(TimeGridColumnPlaceholderContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridColumnPlaceholderContext` is missing. TimeGrid.useColumnPlaceholder() must be placed within <TimeGrid.Column />.',
    );
  }
  return context;
}
