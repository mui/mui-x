import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  computeElementPositionInCollection,
  isFullDayAxisWindow,
} from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventOccurrence,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

type OccurrencePosition = ReturnType<typeof computeElementPositionInCollection>;

export interface EventTimelinePremiumLayoutOccurrence
  extends useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition {
  timelinePosition: OccurrencePosition;
}

/**
 * The visible resources with the occurrences that occupy space on the timeline axis,
 * in row render order. On a trimmed-hour window, filtering and positioning share one
 * pass so "visible" and "has a non-zero width" are the same predicate, and mounted
 * rows reuse the positions instead of recomputing them.
 */
const visibleAxisDataSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  eventTimelinePremiumPresetSelectors.config,
  (state: State) => {
    const config = eventTimelinePremiumPresetSelectors.config(state);
    return schedulerOccurrenceSelectors.groupedByResourceList(state, config.start, config.end);
  },
  (adapter, config, resources) => {
    if (isFullDayAxisWindow(config)) {
      return { resources, positionByOccurrenceKey: null };
    }

    const positionByOccurrenceKey = new Map<string, OccurrencePosition>();
    return {
      resources: resources.map((entry) => ({
        ...entry,
        occurrences: entry.occurrences.filter((occurrence) => {
          const position = computeElementPositionInCollection(adapter, {
            start: occurrence.displayTimezone.start,
            end: occurrence.displayTimezone.end,
            collection: config,
            durationMs: config.durationMs,
          });
          if (position.duration === 0) {
            return false;
          }
          positionByOccurrenceKey.set(occurrence.key, position);
          return true;
        }),
      })),
      positionByOccurrenceKey,
    };
  },
);

/**
 * The filtered source for all timeline layout consumers. Using this list keeps hidden
 * occurrences out of rendered lanes, lane counts, dependency arrows, and tab navigation.
 */
const visibleGroupedByResourceListSelector = createSelector(
  visibleAxisDataSelector,
  (data) => data.resources,
);

const visibleOccurrencesByResourceMapSelector = createSelectorMemoized(
  visibleGroupedByResourceListSelector,
  (groupedByResourceList) => {
    const map = new Map<SchedulerResourceId, SchedulerEventOccurrence[]>();
    for (const { resource, occurrences } of groupedByResourceList) {
      map.set(resource.id, occurrences);
    }
    return map;
  },
);

export function addTimelinePositionsToOccurrences({
  adapter,
  config,
  occurrences,
  positionByOccurrenceKey,
}: {
  adapter: Adapter;
  config: ReturnType<typeof eventTimelinePremiumPresetSelectors.config>;
  occurrences: useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition[];
  positionByOccurrenceKey: ReadonlyMap<string, OccurrencePosition> | null;
}): EventTimelinePremiumLayoutOccurrence[] {
  return occurrences.map((occurrence) => ({
    ...occurrence,
    timelinePosition:
      positionByOccurrenceKey?.get(occurrence.key) ??
      computeElementPositionInCollection(adapter, {
        start: occurrence.displayTimezone.start,
        end: occurrence.displayTimezone.end,
        collection: config,
        durationMs: config.durationMs,
      }),
  }));
}

export const eventTimelinePremiumOccurrenceSelectors = {
  visibleGroupedByResourceList: visibleGroupedByResourceListSelector,
  /**
   * The axis position of every visible occurrence, or `null` on the full-day window
   * (where filtering is an identity and mounted rows derive positions on demand).
   */
  visiblePositionByOccurrenceKey: createSelector(
    visibleAxisDataSelector,
    (data): ReadonlyMap<string, OccurrencePosition> | null => data.positionByOccurrenceKey,
  ),
  visibleResourceOccurrences: createSelector(
    visibleOccurrencesByResourceMapSelector,
    (map, resourceId: SchedulerResourceId): readonly SchedulerEventOccurrence[] =>
      map.get(resourceId) ?? EMPTY_ARRAY,
  ),
};
