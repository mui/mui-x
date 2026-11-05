import { createSelectorMemoized } from '@base-ui/utils/store';
import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
  SchedulerRenderableEventOccurrence,
  SchedulerResource,
} from '../models';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { schedulerEventSelectors } from './schedulerEventSelectors';
import { schedulerResourceSelectors } from './schedulerResourceSelectors';
import { getOccurrencesFromEvents, getEventResourceIds } from '../internals/utils/event-utils';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

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

const resourceOrAncestorMatches = (state: State, resourceId: string, targetId: string): boolean => {
  const parentLookup = schedulerResourceSelectors.resourceParentIdLookup(state);
  let current: string | null | undefined = resourceId;
  while (current != null) {
    if (current === targetId) {
      return true;
    }
    current = parentLookup.get(current) as string | null | undefined;
  }
  return false;
};

export const schedulerOccurrenceSelectors = {
  /**
   * Whether the occurrence is highlighted or dimmed by `state.occurrenceHighlight`,
   * `'none'` when nothing is highlighted.
   */
  highlightState: (
    state: State,
    occurrence: Pick<SchedulerRenderableEventOccurrence, 'resource' | 'displayTimezone'>,
  ): 'none' | 'highlighted' | 'dimmed' => {
    const highlight = state.occurrenceHighlight;
    if (highlight == null) {
      return 'none';
    }
    const resourceIds = getEventResourceIds(occurrence.resource);
    let matchesResource = true;
    if (highlight.resourceId === null) {
      matchesResource = resourceIds.length === 0;
    } else if (highlight.resourceId !== undefined) {
      const targetId = highlight.resourceId;
      matchesResource = resourceIds.some((id) => resourceOrAncestorMatches(state, id, targetId));
    }
    const matchesRange =
      highlight.range == null ||
      (occurrence.displayTimezone.start.timestamp < highlight.range.end &&
        occurrence.displayTimezone.end.timestamp > highlight.range.start);
    return matchesResource && matchesRange ? 'highlighted' : 'dimmed';
  },
  isStarted: (state: State, start: SchedulerProcessedDate) => start.timestamp <= state.nowTimestamp,
  isEnded: (state: State, end: SchedulerProcessedDate) => end.timestamp < state.nowTimestamp,
  groupedByResourceList: occurrencesGroupedByResourceListSelector,
};
