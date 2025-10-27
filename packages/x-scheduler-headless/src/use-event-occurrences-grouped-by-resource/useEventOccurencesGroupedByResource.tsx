import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarResource,
  SchedulerValidDate,
} from '../models';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { useAdapter, Adapter } from '../use-adapter';
import { useTimelineStoreContext } from '../use-timeline-store-context';
import { selectors } from '../use-timeline';

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

interface InnerGetEventOccurrencesGroupedByResourceReturnValue {
  resource: CalendarResource;
  occurrences: CalendarEventOccurrence[];
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
): InnerGetEventOccurrencesGroupedByResourceReturnValue[] {
  const occurrencesGroupedByResource = new Map<string, CalendarEventOccurrence[]>();

  const occurrences = getOccurrencesFromEvents({ adapter, start, end, events, visibleResources });

  for (const occurrence of occurrences) {
    const resourceId = occurrence.resource;

    if (resourceId) {
      if (!occurrencesGroupedByResource.has(resourceId)) {
        occurrencesGroupedByResource.set(resourceId, []);
      }
      occurrencesGroupedByResource.get(resourceId)!.push(occurrence);
    }
  }

  const processResources = (innerResources: CalendarResource[]) => {
    const sortedResources = innerResources.sort((a, b) => a.title.localeCompare(b.title));
    return sortedResources.reduce(
      (acc: InnerGetEventOccurrencesGroupedByResourceReturnValue[], resource: CalendarResource) => {
        acc.push({ resource, occurrences: occurrencesGroupedByResource.get(resource.id) ?? [] });
        if (resource.children && resource.children.length > 0) {
          acc.push(...processResources(resource.children));
        }
        return acc;
      },
      [],
    );
  };

  return processResources(resources);
}
