'use client';
import * as React from 'react';

export interface TimelineGridEventRowContext {
  /**
   * Gets the cursor position in the element in milliseconds.
   * @param {Object} parameters The parameters of the method.
   * @param {{ clientX: number }} parameters.input The input object provided by the drag and drop library for the current event.
   * @param {React.RefObject<HTMLElement | null>} parameters.elementRef The ref of the element on which the event has been triggered.
   * @returns {number} The cursor position in milliseconds.
   */
  getCursorPositionInElementMs: ({
    input,
    elementRef,
  }: {
    input: { clientX: number };
    elementRef: React.RefObject<HTMLElement | null>;
  }) => number;
}

export const TimelineGridEventRowContext = React.createContext<
  TimelineGridEventRowContext | undefined
>(undefined);

export function useTimelineGridEventRowContext() {
  const context = React.useContext(TimelineGridEventRowContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `TimelineGridEventRowContext` is missing. <TimelineGrid.Event /> part must be placed within <TimelineGrid.EventRow />.',
    );
  }
  return context;
}
