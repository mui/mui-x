'use client';
import * as React from 'react';
import type { useDraggableEvent } from '@mui/x-scheduler-headless/internals';
import type { TimelinePremiumEvent } from './TimelinePremiumEvent';

export interface TimelinePremiumEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the Timeline.Event and Timeline.EventResizeHandler parts.
   * @param {{ clientX: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {TimelinePremiumEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientX: number }) => TimelinePremiumEvent.SharedDragData;
}

export const TimelinePremiumEventContext = React.createContext<
  TimelinePremiumEventContext | undefined
>(undefined);

export function useTimelinePremiumEventContext() {
  const context = React.useContext(TimelinePremiumEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `TimelinePremiumEventContext` is missing. Timeline Event parts must be placed within <Timeline.Event />.',
    );
  }
  return context;
}
