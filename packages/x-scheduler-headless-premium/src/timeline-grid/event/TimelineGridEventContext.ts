'use client';
import * as React from 'react';
import type { useDraggableEvent } from '@mui/x-scheduler-headless/internals';
import type { TimelineGridEvent } from './TimelineGridEvent';

export interface TimelineGridEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the TimelineGrid.Event and TimelineGrid.EventResizeHandler parts.
   * @param {{ clientX: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {TimelineGridEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientX: number }) => TimelineGridEvent.SharedDragData;
}

export const TimelineGridEventContext = React.createContext<TimelineGridEventContext | undefined>(
  undefined,
);

export function useTimelineGridEventContext() {
  const context = React.useContext(TimelineGridEventContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `TimelineGridEventContext` is missing. TimelineGrid Event parts must be placed within <TimelineGrid.Event />.',
    );
  }
  return context;
}
