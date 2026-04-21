'use client';
import * as React from 'react';

export const TimelineGridSubGridContext = React.createContext<true | undefined>(undefined);

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
