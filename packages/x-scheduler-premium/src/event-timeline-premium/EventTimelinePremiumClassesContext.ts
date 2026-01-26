'use client';
import * as React from 'react';
import type { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

export const EventTimelinePremiumClassesContext =
  React.createContext<EventTimelinePremiumClasses | null>(null);

export function useEventTimelinePremiumClasses(): EventTimelinePremiumClasses {
  const classes = React.useContext(EventTimelinePremiumClassesContext);
  if (!classes) {
    throw new Error(
      'MUI Scheduler: useEventTimelinePremiumClasses must be used within EventTimelinePremiumClassesContext.Provider',
    );
  }
  return classes;
}
