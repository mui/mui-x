'use client';
import * as React from 'react';
import type { EventTimelineLocaleText } from '@mui/x-scheduler/models';
import type { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

export interface EventTimelinePremiumStyledContextValue {
  schedulerId: string | undefined;
  classes: EventTimelinePremiumClasses;
  localeText: EventTimelineLocaleText;
  resourceColumnLabel?: string;
}

export const EventTimelinePremiumStyledContext =
  React.createContext<EventTimelinePremiumStyledContextValue | null>(null);

export function useEventTimelinePremiumStyledContext(): EventTimelinePremiumStyledContextValue {
  const value = React.useContext(EventTimelinePremiumStyledContext);
  if (!value) {
    throw new Error(
      'MUI X Scheduler: EventTimelinePremiumStyledContext is missing. ' +
        '`useEventTimelinePremiumStyledContext` cannot read the timeline styled context (classes, localeText, resourceColumnLabel) without a provider. ' +
        'Make sure the calling component is rendered inside <EventTimelinePremium />.',
    );
  }
  return value;
}
