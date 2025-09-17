'use client';
import * as React from 'react';
import type { DayGridEvent } from './DayGridEvent';

export interface DayGridEventContext {
  /**
   * Whether this event is starting before the row starts.
   */
  doesEventStartBeforeRowStart: boolean;
  /**
   * Whether this event is ending after the row ends.
   */
  doesEventEndAfterRowEnd: boolean;
  /**
   * Sets whether the event is being resized.
   */
  setIsResizing: (isResizing: boolean) => void;
  /**
   * Gets the drag data shared by the DayGrid.Event and DayGrid.EventResizeHandler parts.
   * @param {{ clientY: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {DayGridEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientY: number }) => DayGridEvent.SharedDragData;
}

export const DayGridEventContext = React.createContext<DayGridEventContext | undefined>(undefined);

export function useDayGridEventContext() {
  const context = React.useContext(DayGridEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `DayGridEventContext` is missing. DayGrid Event parts must be placed within <DayGrid.Event />.',
    );
  }
  return context;
}
