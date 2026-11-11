'use client';
import * as React from 'react';
import type { useDraggableEvent } from '@mui/x-scheduler-internals/internals';
import type { TimelineGridEvent } from './TimelineGridEvent';

export interface TimelineGridEventContext extends useDraggableEvent.ContextValue<TimelineGridEvent.DragData> {}

export const TimelineGridEventContext = React.createContext<TimelineGridEventContext | undefined>(
  undefined,
);

export function useTimelineGridEventContext() {
  const context = React.useContext(TimelineGridEventContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: `TimelineGridEventContext` is missing. TimelineGrid Event parts must be placed within <TimelineGrid.Event />.',
    );
  }
  return context;
}
