'use client';
import * as React from 'react';

export interface EventTimelinePremiumEventRowContext {
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

export const EventTimelinePremiumEventRowContext = React.createContext<
  EventTimelinePremiumEventRowContext | undefined
>(undefined);

export function useEventTimelinePremiumEventRowContext() {
  const context = React.useContext(EventTimelinePremiumEventRowContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `EventTimelinePremiumEventRowContext` is missing. <EventTimelinePremium.Event /> part must be placed within <EventTimelinePremium.EventRow />.',
    );
  }
  return context;
}
