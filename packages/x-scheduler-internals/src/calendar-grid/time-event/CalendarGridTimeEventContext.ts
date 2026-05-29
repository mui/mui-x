'use client';
import * as React from 'react';
import type { CalendarGridTimeEvent } from './CalendarGridTimeEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridTimeEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the CalendarGrid.TimeEvent and CalendarGrid.TimeEventResizeHandler parts.
   * @param {{ clientY: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {CalendarGridTimeEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientY: number }) => CalendarGridTimeEvent.SharedDragData;
  /**
   * Called when a drag (move or resize) is about to start. Returning `false` aborts the attempt.
   * Defaults to always allowing the drag when not provided.
   */
  canDrag?: () => boolean;
  /**
   * Ref to the event's root element. Used by the pointer-based resize handler to read the
   * geometry of the column the event is positioned within (the root's offset parent).
   */
  rootRef: React.RefObject<HTMLDivElement | null>;
}

export const CalendarGridTimeEventContext = React.createContext<
  CalendarGridTimeEventContext | undefined
>(undefined);

export function useCalendarGridTimeEventContext() {
  const context = React.useContext(CalendarGridTimeEventContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: `CalendarGridTimeEventContext` is missing. CalendarGrid TimeEvent parts must be placed within <CalendarGrid.TimeEvent />.',
    );
  }
  return context;
}
