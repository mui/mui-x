'use client';
import * as React from 'react';
import type { TimeGridEvent } from './TimeGridEvent';

export interface TimeGridEventContext {
  /**
   * Whether this event is starting before the column starts.
   */
  doesEventStartBeforeColumnStart: boolean;
  /**
   * Whether this event is ending after the column ends.
   */
  doesEventEndAfterColumnEnd: boolean;
  /**
   * Sets whether the event is being resized.
   */
  setIsResizing: (isResizing: boolean) => void;
  /**
   * Gets the drag data shared by the TimeGrid.Event and TimeGrid.EventResizeHandler parts.
   * @param {{ clientY: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {TimeGridEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientY: number }) => TimeGridEvent.SharedDragData;
}

export const TimeGridEventContext = React.createContext<TimeGridEventContext | undefined>(
  undefined,
);

export function useTimeGridEventContext() {
  const context = React.useContext(TimeGridEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimeGridEventContext` is missing. TimeGrid Event parts must be placed within <TimeGrid.Event />.',
    );
  }
  return context;
}
