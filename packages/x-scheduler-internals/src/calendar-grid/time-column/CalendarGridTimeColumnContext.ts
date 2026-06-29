'use client';
import * as React from 'react';
import { TemporalSupportedObject } from '../../models';

export interface CalendarGridTimeColumnContext {
  /**
   * The start date and time of the column.
   */
  start: TemporalSupportedObject;
  /**
   * The end date and time of the column.
   */
  end: TemporalSupportedObject;
  /**
   * The index of the column in the grid.
   */
  index: number;
  /**
   * Whether this column currently owns focus within the grid.
   * When `true`, interactive children (e.g. events) should use `tabIndex={0}`
   * so they are reachable via Tab; when `false`, they should use `tabIndex={-1}`.
   */
  hasFocus: boolean;
  /**
   * Gets the cursor position in the element in milliseconds.
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
  /**
   * Maps a pointer position to a precision-rounded date within this column (vertical axis), used by the pointer-based resize.
   * @param {{ clientX: number, clientY: number }} input The pointer coordinates.
   * @returns {TemporalSupportedObject | null} The date under the pointer, or `null` when the column isn't measurable yet.
   */
  getDateAtPointer: (input: { clientX: number; clientY: number }) => TemporalSupportedObject | null;
}

export const CalendarGridTimeColumnContext = React.createContext<
  CalendarGridTimeColumnContext | undefined
>(undefined);

export function useCalendarGridTimeColumnContext() {
  const context = React.useContext(CalendarGridTimeColumnContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: `CalendarGridTimeColumnContext` is missing. <CalendarGrid.TimeEvent /> must be placed within <CalendarGrid.TimeColumn />.',
    );
  }
  return context;
}
