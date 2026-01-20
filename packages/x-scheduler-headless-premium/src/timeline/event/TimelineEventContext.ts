'use client';
import * as React from 'react';
import type { useDraggableEvent } from '@mui/x-scheduler-headless/utils';
import type { TimelineEvent } from './TimelineEvent';

export interface TimelineEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the Timeline.Event and Timeline.EventResizeHandler parts.
   * @param {{ clientX: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {TimelineEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientX: number }) => TimelineEvent.SharedDragData;
}

export const TimelineEventContext = React.createContext<TimelineEventContext | undefined>(
  undefined,
);

export function useTimelineEventContext() {
  const context = React.useContext(TimelineEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelineEventContext` is missing. Timeline Event parts must be placed within <Timeline.Event />.',
    );
  }
  return context;
}
