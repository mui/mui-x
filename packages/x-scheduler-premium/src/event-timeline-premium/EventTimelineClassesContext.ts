'use client';
import * as React from 'react';
import type { EventTimelineClasses } from './eventTimelineClasses';

export const EventTimelineClassesContext = React.createContext<EventTimelineClasses | null>(null);

export function useEventTimelineClasses(): EventTimelineClasses {
  const classes = React.useContext(EventTimelineClassesContext);
  if (!classes) {
    throw new Error(
      'useEventTimelineClasses must be used within EventTimelineClassesContext.Provider',
    );
  }
  return classes;
}
