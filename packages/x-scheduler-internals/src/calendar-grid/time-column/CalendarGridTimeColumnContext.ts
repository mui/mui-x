'use client';
import * as React from 'react';
import type { TimelineAxis } from '../../internals/utils/timeline-axis';
import type { PlainDate } from '../../internals/utils/base-temporal/PlainDate';

export interface CalendarGridTimeColumnContext {
  /**
   * The date of the column, in the display timezone.
   */
  plainDate: PlainDate;
  /**
   * The axis of the column: its bounds, read in the display timezone, and the hour window of the
   * view.
   */
  axis: TimelineAxis;
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
   * @param {number} parameters.elementStart The start of the element as a timestamp, when known. Disambiguates an element starting in the hour repeated by a DST transition.
   * @returns {number} The cursor position in milliseconds.
   */
  getCursorPositionInElementMs: ({
    input,
    elementRef,
    elementStart,
  }: {
    input: { clientY: number };
    elementRef: React.RefObject<HTMLElement | null>;
    elementStart?: number;
  }) => number;
  /**
   * Maps a pointer position to a precision-rounded timestamp within this column (vertical axis), used by the pointer-based resize.
   * @param {{ clientX: number, clientY: number }} input The pointer coordinates.
   * @returns {number | null} The timestamp under the pointer, or `null` when the column isn't measurable yet.
   */
  getTimestampAtPointer: (input: { clientX: number; clientY: number }) => number | null;
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
