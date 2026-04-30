import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import {
  OccurrenceContainerLayout,
  OccurrenceLanePosition,
  SchedulerEventOccurrence,
  SchedulerOccurrencePositions,
  SchedulerResourceId,
  TemporalSupportedObject,
} from '@mui/x-scheduler-headless/models';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { computeTimedLanes } from '@mui/x-scheduler-headless/internals';
import type { EventTimelinePremiumState as State } from '../use-event-timeline-premium';
import { eventTimelinePremiumPresetSelectors } from './eventTimelinePremiumPresetSelectors';

export interface TimelineVisibleWindow {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
}

export interface SchedulerTimelineOccurrencesByResource {
  byKey: ReadonlyMap<string, SchedulerEventOccurrence>;
  keysByResource: ReadonlyMap<SchedulerResourceId, readonly string[]>;
  resourceIds: readonly SchedulerResourceId[];
}

const EMPTY_OCCURRENCES: SchedulerTimelineOccurrencesByResource = {
  byKey: new Map(),
  keysByResource: new Map(),
  resourceIds: EMPTY_ARRAY as readonly SchedulerResourceId[],
};

const EMPTY_POSITIONS: SchedulerOccurrencePositions<OccurrenceContainerLayout> = {
  positionByKey: new Map(),
  byContainer: new Map(),
  maxLane: 1,
};

/**
 * Visible time window for the timeline. Split out of `eventTimelinePremiumPresetSelectors.config`
 * so the occurrences cache is not invalidated by header / tickWidth changes.
 */
const visibleWindowSelector = createSelectorMemoized(
  eventTimelinePremiumPresetSelectors.config,
  (config): TimelineVisibleWindow => ({ start: config.start, end: config.end }),
);

/**
 * All occurrences visible in the timeline, indexed by occurrence key and grouped by
 * resource. Reuses `schedulerOccurrenceSelectors.groupedByResourceList` for the heavy
 * recurring-event expansion work.
 */
const visibleOccurrencesSelector = createSelectorMemoized(
  visibleWindowSelector,
  (state: State) => {
    const window = visibleWindowSelector(state);
    return schedulerOccurrenceSelectors.groupedByResourceList(state, window.start, window.end);
  },
  (_window, groupedByResource): SchedulerTimelineOccurrencesByResource => {
    const byKey = new Map<string, SchedulerEventOccurrence>();
    const keysByResource = new Map<SchedulerResourceId, string[]>();
    const resourceIds: SchedulerResourceId[] = [];

    for (const { resource, occurrences } of groupedByResource) {
      resourceIds.push(resource.id);
      const keys: string[] = [];
      for (const occurrence of occurrences) {
        byKey.set(occurrence.key, occurrence);
        keys.push(occurrence.key);
      }
      keysByResource.set(resource.id, keys);
    }

    return { byKey, keysByResource, resourceIds };
  },
);

/**
 * Lane positions per resource. Depends on the occurrence-index output, never on raw
 * events — so changing positioning logic doesn't invalidate the occurrences cache.
 */
const positionsSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  visibleOccurrencesSelector,
  (adapter, occurrences) => {
    const containers: [string, readonly string[]][] = [];
    for (const resourceId of occurrences.resourceIds) {
      containers.push([resourceId, occurrences.keysByResource.get(resourceId) ?? EMPTY_ARRAY]);
    }
    return computeTimedLanes({
      adapter,
      occurrencesByKey: occurrences.byKey,
      containers,
      maxSpan: 1,
    });
  },
);

export const eventTimelineOccurrencePositionSelectors = {
  /** Visible `{ start, end }` window. */
  visibleWindow: visibleWindowSelector,
  /** All occurrences in the timeline, indexed for O(1) by-key and by-resource reads. */
  visibleOccurrences: visibleOccurrencesSelector,
  /** Lane positions per resource. */
  positions: positionsSelector,
  /** O(1) — keys of occurrences in a row. */
  occurrenceKeysForResource: createSelector(
    visibleOccurrencesSelector,
    (occurrences, resourceId: SchedulerResourceId): readonly string[] =>
      occurrences.keysByResource.get(resourceId) ?? EMPTY_ARRAY,
  ),
  /** O(1) — layout for one row (orderedKeys, positionByKey, usedLanes, maxLane). */
  layoutForResource: createSelector(
    positionsSelector,
    (positions, resourceId: SchedulerResourceId): OccurrenceContainerLayout | null =>
      positions.byContainer.get(resourceId) ?? null,
  ),
  /** O(1) — lane position for one occurrence (across all rows). */
  positionByKey: createSelector(
    positionsSelector,
    (positions, occurrenceKey: string): OccurrenceLanePosition | null =>
      positions.positionByKey.get(occurrenceKey) ?? null,
  ),
  /** Largest lane used in a row (defaults to 1 when the row is empty / unknown). */
  maxLaneForResource: createSelector(
    positionsSelector,
    (positions, resourceId: SchedulerResourceId): number =>
      positions.byContainer.get(resourceId)?.maxLane ?? 1,
  ),
  /** Empty-state defaults exported for callers that need a stable empty value. */
  empty: { occurrences: EMPTY_OCCURRENCES, positions: EMPTY_POSITIONS },
};
