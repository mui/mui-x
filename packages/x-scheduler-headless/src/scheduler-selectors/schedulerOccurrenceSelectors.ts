import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
  SchedulerResource,
  TemporalSupportedObject,
} from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { getOccurrencesFromEvents } from '../utils/event-utils';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

const occurrencesGroupedByResourceListSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerResourceSelectors.processedResourceList,
  schedulerResourceSelectors.processedResourceChildrenLookup,
  schedulerResourceSelectors.resourceParentIdLookup,
  schedulerOtherSelectors.displayTimezone,

  (
    adapter,
    events,
    visibleResources,
    resources,
    resourcesChildrenMap,
    resourceParentIds,
    displayTimezone,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => {
    const occurrencesGroupedByResource = new Map<string, SchedulerEventOccurrence[]>();

    const occurrences = getOccurrencesFromEvents({
      adapter,
      start,
      end,
      events,
      visibleResources,
      resourceParentIds,
      displayTimezone,
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
      const result: {
        resource: SchedulerResource;
        occurrences: SchedulerEventOccurrence[];
      }[] = [];

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
  },
);

const occurrencesGroupedByResourceMapSelector = createSelectorMemoized(
  occurrencesGroupedByResourceListSelector,
  (groupedByResourceList, _start: TemporalSupportedObject, _end: TemporalSupportedObject) => {
    const map = new Map<string, SchedulerEventOccurrence[]>();
    for (const { resource, occurrences } of groupedByResourceList) {
      map.set(resource.id, occurrences);
    }
    return map;
  },
);

export const schedulerOccurrenceSelectors = {
  // TODO: Pass the occurrence key instead of the start and end dates once the occurrences are stored in the state.
  isStartedOrEnded: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, start: SchedulerProcessedDate, end: SchedulerProcessedDate) => {
      return {
        started: adapter.isBefore(start.value, now) || adapter.isEqual(start.value, now),
        ended: adapter.isBefore(end.value, now),
      };
    },
  ),
  groupedByResourceList: occurrencesGroupedByResourceListSelector,
  resourceOccurrences: createSelector(
    occurrencesGroupedByResourceMapSelector,
    (
      map,
      _start: TemporalSupportedObject,
      end: TemporalSupportedObject,
      resourceId: string,
    ): readonly SchedulerEventOccurrence[] => map.get(resourceId) ?? EMPTY_ARRAY,
  ),
};
