'use client';
import * as React from 'react';
import type { SchedulerPublicAPI } from '../internals/models/publicAPI';
import type { EventCalendarStore } from '../use-event-calendar/EventCalendarStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `EventCalendar` component.
 */
export function useEventCalendarApiRef<
  TEvent extends object = object,
  TResource extends object = object,
>() {
  return React.useRef(undefined) as React.RefObject<
    SchedulerPublicAPI<EventCalendarStore<TEvent, TResource>> | undefined
  >;
}
