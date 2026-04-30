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
import {
  computeTimedLanes,
  ComputeTimedLanesPrevious,
} from '@mui/x-scheduler-headless/internals';
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

function arraysShallowEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Visible time window for the timeline. Split out of `eventTimelinePremiumPresetSelectors.config`
 * so the occurrences cache is not invalidated by header / tickWidth changes.
 */
const visibleWindowSelector = createSelectorMemoized(
  eventTimelinePremiumPresetSelectors.config,
  (config): TimelineVisibleWindow => ({ start: config.start, end: config.end }),
);

/**
 * All occurrences visible in the timeline, indexed by occurrence key and grouped by resource.
 *
 * Per-resource key arrays are kept reference-stable across calls when their content is
 * unchanged, so downstream `computeTimedLanes` can short-circuit per-resource.
 */
let previousVisibleOccurrences: SchedulerTimelineOccurrencesByResource | null = null;
const visibleOccurrencesSelector = createSelectorMemoized(
  visibleWindowSelector,
  (state: State) => {
    const window = visibleWindowSelector(state);
    return schedulerOccurrenceSelectors.groupedByResourceList(state, window.start, window.end);
  },
  (_window, groupedByResource): SchedulerTimelineOccurrencesByResource => {
    const byKey = new Map<string, SchedulerEventOccurrence>();
    const keysByResource = new Map<SchedulerResourceId, readonly string[]>();
    const resourceIds: SchedulerResourceId[] = [];

    for (const { resource, occurrences } of groupedByResource) {
      resourceIds.push(resource.id);
      const keys: string[] = [];
      for (const occurrence of occurrences) {
        byKey.set(occurrence.key, occurrence);
        keys.push(occurrence.key);
      }

      // Reuse the previous array reference when content is unchanged so per-resource
      // subscribers (`occurrenceKeysForResource`) don't see spurious changes.
      const previousKeys = previousVisibleOccurrences?.keysByResource.get(resource.id);
      if (previousKeys !== undefined && arraysShallowEqual(keys, previousKeys)) {
        keysByResource.set(resource.id, previousKeys);
      } else {
        keysByResource.set(resource.id, keys);
      }
    }

    const result = { byKey, keysByResource, resourceIds };
    previousVisibleOccurrences = result;
    return result;
  },
);

/**
 * Lane positions per resource. Depends on the occurrence index, not on raw events,
 * so positioning changes do not invalidate the occurrences cache.
 *
 * `previous` is threaded in so that resources whose keys + occurrence references are
 * unchanged keep the same `OccurrenceContainerLayout` reference, and individual
 * `OccurrenceLanePosition` objects are interned across calls.
 */
let previousPositions: ComputeTimedLanesPrevious | null = null;
const positionsSelector = createSelectorMemoized(
  (state: State) => state.adapter,
  visibleOccurrencesSelector,
  (adapter, occurrences) => {
    const containers: [string, readonly string[]][] = [];
    const containerKeysByContainer = new Map<string, readonly string[]>();
    for (const resourceId of occurrences.resourceIds) {
      const keys = occurrences.keysByResource.get(resourceId) ?? EMPTY_ARRAY;
      containers.push([resourceId, keys]);
      containerKeysByContainer.set(resourceId, keys);
    }
    const result = computeTimedLanes({
      adapter,
      occurrencesByKey: occurrences.byKey,
      containers,
      maxSpan: 1,
      previous: previousPositions,
    });
    previousPositions = {
      result,
      occurrencesByKey: occurrences.byKey,
      containerKeysByContainer,
    };
    return result;
  },
);

export const eventTimelineOccurrencePositionSelectors = {
  /** Visible `{ start, end }` window. */
  visibleWindow: visibleWindowSelector,
  /** All occurrences in the timeline, indexed by occurrence key and grouped by resource. */
  visibleOccurrences: visibleOccurrencesSelector,
  /** Lane positions per resource. */
  positions: positionsSelector,
  /** Keys of occurrences in a row. */
  occurrenceKeysForResource: createSelector(
    visibleOccurrencesSelector,
    (occurrences, resourceId: SchedulerResourceId): readonly string[] =>
      occurrences.keysByResource.get(resourceId) ?? EMPTY_ARRAY,
  ),
  /** Layout for one row (orderedKeys, positionByKey, usedLanes, maxLane). */
  layoutForResource: createSelector(
    positionsSelector,
    (positions, resourceId: SchedulerResourceId | null): OccurrenceContainerLayout | null =>
      resourceId == null ? null : (positions.byContainer.get(resourceId) ?? null),
  ),
  /** Lane position for one occurrence (across all rows). */
  positionByKey: createSelector(
    positionsSelector,
    (positions, occurrenceKey: string | null): OccurrenceLanePosition | null =>
      occurrenceKey == null ? null : (positions.positionByKey.get(occurrenceKey) ?? null),
  ),
  /** Per-key occurrence object (across all resources). */
  occurrenceByKey: createSelector(
    visibleOccurrencesSelector,
    (occurrences, occurrenceKey: string): SchedulerEventOccurrence | null =>
      occurrences.byKey.get(occurrenceKey) ?? null,
  ),
  /** Largest lane used in a row (defaults to 1 when the row is empty / unknown). */
  maxLaneForResource: createSelector(
    positionsSelector,
    (positions, resourceId: SchedulerResourceId | null): number =>
      resourceId == null ? 1 : (positions.byContainer.get(resourceId)?.maxLane ?? 1),
  ),
  /** Empty-state defaults exported for callers that need a stable empty value. */
  empty: { occurrences: EMPTY_OCCURRENCES, positions: EMPTY_POSITIONS },
};
