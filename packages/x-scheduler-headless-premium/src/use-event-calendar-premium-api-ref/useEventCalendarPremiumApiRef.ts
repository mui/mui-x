'use client';
import * as React from 'react';
import { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { EventCalendarPremiumStore } from '../use-event-calendar-premium/EventCalendarPremiumStore';

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
