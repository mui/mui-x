'use client';
import * as React from 'react';

export interface TimelineGridSubGridContext {}

export const TIMELINE_GRID_SUB_GRID_CONTEXT_VALUE: TimelineGridSubGridContext = {};

export const TimelineGridSubGridContext = React.createContext<TimelineGridSubGridContext | undefined>(
  undefined,
);

export function useTimelineGridSubGridContext() {
  const context = React.useContext(TimelineGridSubGridContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: TimelineGridSubGridContext is missing. ' +
        '<TimelineGrid.TitleRow /> and <TimelineGrid.EventRow /> must be placed within <TimelineGrid.SubGrid />.',
    );
  }
  return context;
}
