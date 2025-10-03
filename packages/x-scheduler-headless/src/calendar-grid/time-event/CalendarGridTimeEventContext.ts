'use client';
import * as React from 'react';
import type { CalendarGridTimeEvent } from './CalendarGridTimeEvent';

export interface CalendarGridTimeEventContext {
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
   * Gets the drag data shared by the CalendarGrid.TimeEvent and CalendarGrid.TimeEventResizeHandler parts.
   * @param {{ clientY: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {CalendarGridTimeEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientY: number }) => CalendarGridTimeEvent.SharedDragData;
}

export const CalendarGridTimeEventContext = React.createContext<
  CalendarGridTimeEventContext | undefined
>(undefined);

export function useCalendarGridTimeEventContext() {
  const context = React.useContext(CalendarGridTimeEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `CalendarGridTimeEventContext` is missing. CalendarGrid TimeEvent parts must be placed within <CalendarGrid.TimeEvent />.',
    );
  }
  return context;
}
