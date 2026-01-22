'use client';
import * as React from 'react';
import type { CalendarGridDayEvent } from './CalendarGridDayEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridDayEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the CalendarGrid.DayEvent and CalendarGrid.DayEventResizeHandler parts.
   * @param {{ clientY: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {CalendarGridDayEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientY: number }) => CalendarGridDayEvent.SharedDragData;
}

export const CalendarGridDayEventContext = React.createContext<
  CalendarGridDayEventContext | undefined
>(undefined);

export function useCalendarGridDayEventContext() {
  const context = React.useContext(CalendarGridDayEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `CalendarGridDayEventContext` is missing. CalendarGrid DayEvent parts must be placed within <CalendarGrid.DayEvent />.',
    );
  }
  return context;
}
