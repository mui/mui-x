'use client';
import * as React from 'react';
import type { CalendarGridTimeEvent } from './CalendarGridTimeEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridTimeEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the CalendarGrid.TimeEvent and CalendarGrid.TimeEventResizeHandler parts.
   * @param {{ clientY: number }} [input] Pointer position for the grab offset; omit it for pointer-based resize to skip the layout measurement.
   * @returns {CalendarGridTimeEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input?: { clientY: number }) => CalendarGridTimeEvent.SharedDragData;
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
