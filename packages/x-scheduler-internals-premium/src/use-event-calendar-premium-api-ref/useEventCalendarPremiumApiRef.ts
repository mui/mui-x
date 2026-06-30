'use client';
import * as React from 'react';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-internals/internals';
import type { EventCalendarPremiumStore } from '../use-event-calendar-premium/EventCalendarPremiumStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `EventCalendarPremium` component.
 */
export function useEventCalendarPremiumApiRef<
  TEvent extends object = object,
  TResource extends object = object,
>() {
  return React.useRef(undefined) as React.RefObject<
    SchedulerPublicAPI<EventCalendarPremiumStore<TEvent, TResource>> | undefined
  >;
}
