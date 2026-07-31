import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  filterOccurrencesVisibleOnTimelineAxis,
  isFullDayAxisWindow,
} from '@mui/x-scheduler-internals/internals';
import type { SchedulerEventOccurrence, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

const EMPTY_ARRAY: readonly SchedulerEventOccurrence[] = [];

/**
 * The visible resources with the occurrences that occupy space on the timeline axis,
 * in row render order. Every consumer deriving per-row geometry (rendered lanes, lane
 * counts, dependency arrows, tab navigation) must read this list so their lane
 * assignments stay consistent with the rendered rows.
 */
const visibleGroupedByResourceListSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  eventTimelinePremiumPresetSelectors.config,
  (state: State) => {
    const config = eventTimelinePremiumPresetSelectors.config(state);
    return schedulerOccurrenceSelectors.groupedByResourceList(state, config.start, config.end);
  },
  (adapter, config, resources) => {
    if (isFullDayAxisWindow(config)) {
      return resources;
    }
    return resources.map((entry) => ({
      ...entry,
      occurrences: filterOccurrencesVisibleOnTimelineAxis(adapter, config, entry.occurrences),
    }));
  },
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
  visibleResourceOccurrences: createSelector(
    visibleOccurrencesByResourceMapSelector,
    (map, resourceId: SchedulerResourceId): readonly SchedulerEventOccurrence[] =>
      map.get(resourceId) ?? EMPTY_ARRAY,
  ),
};
