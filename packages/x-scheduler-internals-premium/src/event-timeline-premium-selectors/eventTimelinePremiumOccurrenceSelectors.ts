import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  computeElementPositionInCollection,
  isFullDayAxisWindow,
} from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventOccurrence,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const EMPTY_ARRAY: readonly SchedulerEventOccurrence[] = [];

type OccurrencePosition = ReturnType<typeof computeElementPositionInCollection>;

/**
 * The visible resources with the occurrences that occupy space on the timeline axis,
 * in row render order, plus the axis position of each visible occurrence. Filtering and
 * positioning share one pass so "visible" and "has a non-zero width" are the same
 * predicate, and downstream consumers reuse the positions instead of recomputing them.
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
 * Every consumer deriving per-row geometry (rendered lanes, lane counts, dependency
 * arrows, tab navigation) must read this list so their lane assignments stay
 * consistent with the rendered rows.
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

export const eventTimelinePremiumOccurrenceSelectors = {
  visibleGroupedByResourceList: visibleGroupedByResourceListSelector,
  /**
   * The axis position of every visible occurrence, or `null` on the full-day window
   * (where consumers derive positions on demand and the filter is an identity).
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
