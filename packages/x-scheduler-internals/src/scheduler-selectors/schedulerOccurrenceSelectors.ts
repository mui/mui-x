import { createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerEventOccurrence, SchedulerResource } from '../models';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { getOccurrencesFromEvents, getEventResourceIds } from '../internals/utils/event-utils';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';
import type { BaseTemporal } from '../internals/utils/base-temporal';

const occurrencesGroupedByResourceListSelector = createSelectorMemoized(
  schedulerEventSelectors.processedEventRangeIndex,
  schedulerResourceSelectors.visibleMap,
  (state: State) => state.collapsedResources,
  schedulerResourceSelectors.processedResourceList,
  schedulerResourceSelectors.processedResourceChildrenLookup,
  schedulerOtherSelectors.displayTimezone,
  (state: State) => state.recurringEventsPlugin,

  (
    eventRangeIndex,
    visibleResources,
    collapsedResources,
    resources,
    resourcesChildrenMap,
    displayTimezone,
    recurringEventsPlugin,
    start: number,
    end: number,
  ) => {
    const occurrencesGroupedByResource = new Map<string, SchedulerEventOccurrence[]>();

    const occurrences = getOccurrencesFromEvents({
      start,
      end,
      eventRangeIndex,
      visibleResources,
      displayTimezone,
      recurringEventsPlugin,
    });

    for (const occurrence of occurrences) {
      const resourceIds = getEventResourceIds(occurrence.resource);

      resourceIds.forEach((id) => {
        if (!occurrencesGroupedByResource.has(id)) {
          occurrencesGroupedByResource.set(id, []);
        }
        occurrencesGroupedByResource.get(id)!.push(occurrence);
      });
    }

    const processResources = (innerResources: readonly SchedulerResource[]) => {
      const sortedResources = innerResources.toSorted((a, b) => a.title.localeCompare(b.title));
      const result: {
        resource: SchedulerResource;
        occurrences: SchedulerEventOccurrence[];
      }[] = [];

      for (const resource of sortedResources) {
        if (visibleResources[resource.id] === false) {
          continue;
        }

        result.push({
          resource,
          occurrences: occurrencesGroupedByResource.get(resource.id) ?? [],
        });

        if (collapsedResources[resource.id] !== true) {
          const children = resourcesChildrenMap.get(resource.id) ?? [];
          if (children.length > 0) {
            result.push(...processResources(children));
          }
        }
      }

      return result;
    };

    return processResources(resources);
  },
);

export const schedulerOccurrenceSelectors = {
  isStarted: (state: State, start: BaseTemporal.ZonedDateTime) =>
    start.epochMilliseconds <= state.nowTimestamp,
  isEnded: (state: State, end: BaseTemporal.ZonedDateTime) =>
    end.epochMilliseconds < state.nowTimestamp,
  groupedByResourceList: occurrencesGroupedByResourceListSelector,
};
