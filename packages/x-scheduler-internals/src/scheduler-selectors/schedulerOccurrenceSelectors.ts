import { createSelectorMemoized } from '@base-ui/utils/store';
import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
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

export const schedulerOccurrenceSelectors = {
  /**
   * The resource an occurrence is attributed to: the first of its resources that is declared
   * and visible, `null` when there is none.
   */
  attributedResourceId: (
    state: State,
    occurrence: Pick<SchedulerEventOccurrence, 'resource'>,
  ): string | null => {
    const visibleMap = schedulerResourceSelectors.visibleMap(state);
    return (
      getEventResourceIds(occurrence.resource).find(
        (id) => state.processedResourceLookup.has(id) && visibleMap[id] !== false,
      ) ?? null
    );
  },
  /**
   * Whether the occurrence is highlighted or dimmed by `state.occurrenceHighlight`,
   * `'none'` when nothing is highlighted.
   */
  highlightState: (
    state: State,
    occurrence: Pick<SchedulerEventOccurrence, 'resource' | 'displayTimezone' | 'allDay'>,
  ): 'none' | 'highlighted' | 'dimmed' => {
    const highlight = state.occurrenceHighlight;
    if (highlight == null) {
      return 'none';
    }
    const attributedId = schedulerOccurrenceSelectors.attributedResourceId(state, occurrence);
    let matchesResource: boolean;
    if (highlight.resourceId === null || attributedId === null) {
      matchesResource = attributedId === highlight.resourceId;
    } else if (highlight.includeDescendants) {
      matchesResource = schedulerResourceSelectors.isResourceOrDescendant(
        state,
        attributedId,
        highlight.resourceId,
      );
    } else {
      matchesResource = attributedId === highlight.resourceId;
    }
    const matchesRange =
      highlight.range == null ||
      (occurrence.displayTimezone.start.timestamp < highlight.range.end &&
        occurrence.displayTimezone.end.timestamp > highlight.range.start);
    const matchesKind = !highlight.timedOnly || !occurrence.allDay;
    return matchesResource && matchesRange && matchesKind ? 'highlighted' : 'dimmed';
  },
  isStarted: (state: State, start: SchedulerProcessedDate) => start.timestamp <= state.nowTimestamp,
  isEnded: (state: State, end: SchedulerProcessedDate) => end.timestamp < state.nowTimestamp,
  groupedByResourceList: occurrencesGroupedByResourceListSelector,
};
