'use client';
import * as React from 'react';
import { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { EventTimelinePremiumStore } from '../use-event-timeline-premium/EventTimelinePremiumStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `EventTimelinePremium` component.
 */
export function useEventTimelinePremiumApiRef<
  TEvent extends object = object,
  TResource extends object = object,
>() {
  return React.useRef(undefined) as React.RefObject<
    SchedulerPublicAPI<EventTimelinePremiumStore<TEvent, TResource>> | undefined
  >;
}
