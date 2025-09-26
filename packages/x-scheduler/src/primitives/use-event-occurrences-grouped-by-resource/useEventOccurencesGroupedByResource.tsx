import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarResource,
  SchedulerValidDate,
} from '../models';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { useTimelineStoreContext } from '../utils/useTimelineStoreContext';
import { selectors } from '../use-timeline';
import { Adapter } from '../utils/adapter/types';

export function useEventOccurrencesGroupedByResource(
  parameters: useEventOccurrencesGroupedByResource.Parameters,
): useEventOccurrencesGroupedByResource.ReturnValue {
  const { start, end } = parameters;
  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);
  const resources = useStore(store, selectors.resources);

  return React.useMemo(
    () =>
      innerGetEventOccurrencesGroupedByResource(
        adapter,
        events,
        visibleResources,
        resources,
        start,
        end,
      ),
    [adapter, events, visibleResources, resources, start, end],
  );
}

export namespace useEventOccurrencesGroupedByResource {
  export interface Parameters {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export type ReturnValue = {
    resource: CalendarResource;
    occurrences: CalendarEventOccurrence[];
  }[];
}

/**
 * Do not use directly, use the `useEventOccurrencesGroupedByResource` hook instead.
 * This is only exported for testing purposes.
 */
export function innerGetEventOccurrencesGroupedByResource(
  adapter: Adapter,
  events: CalendarEvent[],
  visibleResources: Map<string, boolean>,
  resources: CalendarResource[],
  start: SchedulerValidDate,
  end: SchedulerValidDate,
): { resource: CalendarResource; occurrences: CalendarEventOccurrence[] }[] {
  const occurrencesGroupedByResource = new Map<string, CalendarEventOccurrence[]>();

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
  const filteredResources = resources.filter((resources) =>
    occurrencesGroupedByResource.has(resources.id),
  );

  // Sort by resource.name (localeCompare for stable alphabetical ordering).
  filteredResources.sort((a, b) => a.name.localeCompare(b.name));

  return filteredResources.map((resource) => ({
    resource,
    occurrences: occurrencesGroupedByResource.get(resource.id)!,
  }));
}
