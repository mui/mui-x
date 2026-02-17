'use client';
import * as React from 'react';
import type { EventTimelineLocaleText } from '@mui/x-scheduler/models';
import type { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

export interface EventTimelinePremiumStyledContextValue {
  classes: EventTimelinePremiumClasses;
  localeText: EventTimelineLocaleText;
}

export const EventTimelinePremiumStyledContext =
  React.createContext<EventTimelinePremiumStyledContextValue | null>(null);

export function useEventTimelinePremiumStyledContext(): EventTimelinePremiumStyledContextValue {
  const value = React.useContext(EventTimelinePremiumStyledContext);
  if (!value) {
    throw new Error(
      'MUI X: useEventTimelinePremiumStyledContext must be used within EventTimelinePremiumStyledContext.Provider',
    );
  }
  return value;
}
