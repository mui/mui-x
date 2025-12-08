import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  SchedulerProcessedEvent,
  SchedulerEventOccurrence,
  SchedulerResource,
  TemporalSupportedObject,
} from '../models';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { useAdapter, Adapter } from '../use-adapter';
import { useTimelineStoreContext } from '../use-timeline-store-context';
import { schedulerEventSelectors, schedulerResourceSelectors } from '../scheduler-selectors';
import { TemporalTimezone } from '../base-ui-copy/types/temporal';

export function useEventOccurrencesGroupedByResource(
  parameters: useEventOccurrencesGroupedByResource.Parameters,
): useEventOccurrencesGroupedByResource.ReturnValue {
  const { start, end } = parameters;
  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const events = useStore(store, schedulerEventSelectors.processedEventList);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const uiTimezone = useStore(store, schedulerResourceSelectors.uiTimezone);
  const resourcesChildrenMap = useStore(
    store,
    schedulerResourceSelectors.processedResourceChildrenLookup,
  );
  const resourceParentIds = useStore(store, schedulerResourceSelectors.resourceParentIdLookup);

  return React.useMemo(
    () =>
      innerGetEventOccurrencesGroupedByResource(
        adapter,
        events,
        visibleResources,
        resources,
        resourcesChildrenMap,
        resourceParentIds,
        start,
        end,
        uiTimezone,
      ),
    [
      adapter,
      events,
      visibleResources,
      resources,
      resourcesChildrenMap,
      resourceParentIds,
      start,
      end,
      uiTimezone,
    ],
  );
}

export namespace useEventOccurrencesGroupedByResource {
  export interface Parameters {
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
  }

  export type ReturnValue = {
    resource: SchedulerResource;
    occurrences: SchedulerEventOccurrence[];
  }[];
}

interface InnerGetEventOccurrencesGroupedByResourceReturnValue {
  resource: SchedulerResource;
  occurrences: SchedulerEventOccurrence[];
}

/**
 * Do not use directly, use the `useEventOccurrencesGroupedByResource` hook instead.
 * This is only exported for testing purposes.
 */
export function innerGetEventOccurrencesGroupedByResource(
  adapter: Adapter,
  events: SchedulerProcessedEvent[],
  visibleResources: Map<string, boolean>,
  resources: readonly SchedulerResource[],
  resourcesChildrenMap: Map<string, readonly SchedulerResource[]>,
  resourceParentIds: Map<string, string | null>,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  uiTimezone: TemporalTimezone,
): InnerGetEventOccurrencesGroupedByResourceReturnValue[] {
  const occurrencesGroupedByResource = new Map<string, SchedulerEventOccurrence[]>();

  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    events,
    visibleResources,
    resourceParentIds,
    uiTimezone,
  });

  for (const occurrence of occurrences) {
    const resourceId = occurrence.resource;

    if (resourceId) {
      if (!occurrencesGroupedByResource.has(resourceId)) {
        occurrencesGroupedByResource.set(resourceId, []);
      }
      occurrencesGroupedByResource.get(resourceId)!.push(occurrence);
    }
  }

  const processResources = (innerResources: readonly SchedulerResource[]) => {
    const sortedResources = innerResources.toSorted((a, b) => a.title.localeCompare(b.title));
    const result: InnerGetEventOccurrencesGroupedByResourceReturnValue[] = [];

    for (const resource of sortedResources) {
      result.push({
        resource,
        occurrences: occurrencesGroupedByResource.get(resource.id) ?? [],
      });

      const children = resourcesChildrenMap.get(resource.id) ?? [];
      if (children.length > 0) {
        result.push(...processResources(children));
      }
    }

    return result;
  };

  return processResources(resources);
}
