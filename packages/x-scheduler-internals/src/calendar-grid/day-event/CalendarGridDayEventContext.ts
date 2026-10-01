'use client';
import * as React from 'react';
import type { CalendarGridDayEvent } from './CalendarGridDayEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridDayEventContext extends useDraggableEvent.ContextValue<CalendarGridDayEvent.DragData> {}

export const CalendarGridDayEventContext = React.createContext<
  CalendarGridDayEventContext | undefined
>(undefined);

export function useCalendarGridDayEventContext() {
  const context = React.useContext(CalendarGridDayEventContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: `CalendarGridDayEventContext` is missing. CalendarGrid DayEvent parts must be placed within <CalendarGrid.DayEvent />.',
    );
  }
  return context;
}
