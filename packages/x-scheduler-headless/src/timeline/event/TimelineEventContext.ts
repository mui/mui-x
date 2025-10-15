'use client';
import * as React from 'react';
import type { TimelineEvent } from './TimelineEvent';

export interface TimelineEventContext {
  /**
   * Whether this event is starting before the row starts.
   */
  doesEventStartBeforeRowStart: boolean;
  /**
   * Whether this event is ending after the row ends.
   */
  doesEventEndAfterRowEnd: boolean;
  /**
   * Sets whether the event is being resized.
   */
  setIsResizing: (isResizing: boolean) => void;
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
