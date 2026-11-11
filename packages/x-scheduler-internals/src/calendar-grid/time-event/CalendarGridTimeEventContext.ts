'use client';
import * as React from 'react';
import type { CalendarGridTimeEvent } from './CalendarGridTimeEvent';
import type { useDraggableEvent } from '../../internals/utils/useDraggableEvent';

export interface CalendarGridTimeEventContext extends useDraggableEvent.ContextValue<CalendarGridTimeEvent.DragData> {}

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
