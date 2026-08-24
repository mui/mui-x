'use client';
import * as React from 'react';

export interface TimelineGridBodyRowContext {
  /**
   * The index of this row within the CompositeList.
   * Used by child cells (TitleRow, EventRow) so they can participate
   * in keyboard navigation without registering separately.
   */
  index: number;
}

export const TimelineGridBodyRowContext = React.createContext<
  TimelineGridBodyRowContext | undefined
>(undefined);

export function useTimelineGridBodyRowContext() {
  const context = React.useContext(TimelineGridBodyRowContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: <TimelineGrid.TitleRow /> and <TimelineGrid.EventRow /> must be rendered inside a <TimelineGrid.BodyRow />.',
    );
  }
  return context;
}
