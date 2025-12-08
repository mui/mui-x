'use client';
import * as React from 'react';

export interface TimelineEventRowContext {
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

export const TimelineEventRowContext = React.createContext<TimelineEventRowContext | undefined>(
  undefined,
);

export function useTimelineEventRowContext() {
  const context = React.useContext(TimelineEventRowContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelineEventRowContext` is missing. <Timeline.Event /> part must be placed within <Timeline.EventRow />.',
    );
  }
  return context;
}
