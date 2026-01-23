'use client';
import * as React from 'react';
import type { useDraggableEvent } from '@mui/x-scheduler-headless/internals';
import type { EventTimelinePremiumEvent } from './EventTimelinePremiumEvent';

export interface EventTimelinePremiumEventContext extends useDraggableEvent.ContextValue {
  /**
   * Gets the drag data shared by the EventTimelinePremium.Event and EventTimelinePremium.EventResizeHandler parts.
   * @param {{ clientX: number }} input The input object provided by the drag and drop library for the current event.
   * @returns {EventTimelinePremiumEvent.SharedDragData} The shared drag data.
   */
  getSharedDragData: (input: { clientX: number }) => EventTimelinePremiumEvent.SharedDragData;
}

export const EventTimelinePremiumEventContext = React.createContext<
  EventTimelinePremiumEventContext | undefined
>(undefined);

export function useEventTimelinePremiumEventContext() {
  const context = React.useContext(EventTimelinePremiumEventContext);
  if (context === undefined) {
    throw new Error(
      'Scheduler: `EventTimelinePremiumEventContext` is missing. EventTimelinePremium Event parts must be placed within <EventTimelinePremium.Event />.',
    );
  }
  return context;
}
