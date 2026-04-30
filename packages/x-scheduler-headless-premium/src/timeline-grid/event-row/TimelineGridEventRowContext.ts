'use client';
import * as React from 'react';
import type { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import type { TimelineRowPlaceholder } from './usePlaceholderInRow';

export interface TimelineGridEventRowContext {
  /**
   * The id of the resource this row corresponds to.
   * Exposed via context so children can read per-row data via selectors instead of receiving
   * it as a render-prop argument.
   */
  resourceId: SchedulerResourceId;
  /**
   * Whether this row currently owns focus within the grid.
   * When `true`, interactive children (e.g. events) should use `tabIndex={0}`
   * so they are reachable via Tab; when `false`, they should use `tabIndex={-1}`.
   */
  hasFocus: boolean;
  /**
   * The placeholder to render in this row, or `null` when none is active.
   * Exposed here so consumers don't need to thread it through props.
   */
  placeholder: TimelineRowPlaceholder | null;
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
      'MUI X Scheduler: `TimelineGridEventRowContext` is missing. <TimelineGrid.Event /> part must be placed within <TimelineGrid.EventRow />.',
    );
  }
  return context;
}
