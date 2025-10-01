'use client';
import * as React from 'react';
import { SchedulerValidDate } from '../../models';

export interface CalendarGridTimeColumnContext {
  /**
   * The start date and time of the column.
   */
  start: SchedulerValidDate;
  /**
   * The end date and time of the column.
   */
  end: SchedulerValidDate;
  /**
   * Get the cursor position in the element in milliseconds.
   * @param {Object} parameters The parameters of the method.
   * @param {{ clientY: number }} parameters.input The input object provided by the drag and drop library for the current event.
   * @param {React.RefObject<HTMLElement | null>} parameters.elementRef The ref of the element on which the event has been triggered.
   * @returns {number} The cursor position in milliseconds.
   */
  getCursorPositionInElementMs: ({
    input,
    elementRef,
  }: {
    input: { clientY: number };
    elementRef: React.RefObject<HTMLElement | null>;
  }) => number;
}

export const CalendarGridTimeColumnContext = React.createContext<
  CalendarGridTimeColumnContext | undefined
>(undefined);

export function useCalendarGridTimeColumnContext() {
  const context = React.useContext(CalendarGridTimeColumnContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `CalendarGridTimeColumnContext` is missing. <CalendarGrid.TimeEvent /> must be placed within <CalendarGrid.TimeColumn />.',
    );
  }
  return context;
}
