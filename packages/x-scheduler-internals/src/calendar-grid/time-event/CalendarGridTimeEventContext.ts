'use client';
import * as React from 'react';
import type { CalendarGridTimeEvent } from './CalendarGridTimeEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridTimeEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the CalendarGrid.TimeEvent and CalendarGrid.TimeEventResizeHandler parts.
   * @param {{ clientY: number }} [input] The pointer position, used to compute the grab offset.
   * Omit it when that offset isn't needed (pointer-based resize) to skip the layout measurement.
   * @returns {CalendarGridTimeEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input?: { clientY: number }) => CalendarGridTimeEvent.SharedDragData;
  /**
   * Called when a drag (move or resize) is about to start. Returning `false` aborts the attempt.
   * Defaults to always allowing the drag when not provided.
   */
  canDrag?: () => boolean;
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
