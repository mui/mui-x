import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEvent, CalendarEventOccurrence, SchedulerValidDate } from '../models';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { useEventCalendarStoreContext } from '../utils/useEventCalendarStoreContext';
import { selectors } from '../use-event-calendar';
import { Adapter } from '../utils/adapter/types';

export function useEventOccurrencesGroupedByResource(
  parameters: useEventOccurrencesGroupedByResource.Parameters,
): useEventOccurrencesGroupedByResource.ReturnValue {
  const { start, end } = parameters;
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  return React.useMemo(
    () => innerGetEventOccurrencesGroupedByResource(adapter, events, visibleResources, start, end),
    [adapter, events, visibleResources, start, end],
  );
}

export namespace useEventOccurrencesGroupedByResource {
  export interface Parameters {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export type ReturnValue = Map<string, CalendarEventOccurrence[]>;
}

/**
 * Do not use directly, use the `useEventOccurrencesGroupedByDay` hook instead.
 * This is only exported for testing purposes.
 */
export function innerGetEventOccurrencesGroupedByResource(
  adapter: Adapter,
  events: CalendarEvent[],
  visibleResources: Map<string, boolean>,
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): Map<string, CalendarEventOccurrence[]> {
  const occurrencesGroupedByResource = new Map<string, CalendarEventOccurrence[]>(
    Array.from(visibleResources.keys()).map((resourceId) => [resourceId, []]),
  );

  const occurrences = getOccurrencesFromEvents({ adapter, start, end, events, visibleResources });

  for (const occurrence of occurrences) {
    const resourceId = occurrence.resource;

    if (adapter.isAfter(occurrence.start, end) || adapter.isBefore(occurrence.end, start)) {
      continue;
    }

    if (resourceId) {
      if (!occurrencesGroupedByResource.has(resourceId)) {
        occurrencesGroupedByResource.set(resourceId, []);
      }
      occurrencesGroupedByResource.get(resourceId)!.push(occurrence);
    }
  }

  return occurrencesGroupedByResource;
}
