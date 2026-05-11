import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type {
  SchedulerEventOccurrence,
  SchedulerOccurrencesByDay,
  SchedulerOccurrencePositions,
  OccurrenceContainerLayout,
  DayGridContainerLayout,
  OccurrenceLanePosition,
  SchedulerProcessedDate,
  SchedulerProcessedEvent,
} from '../models';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
} from '../internals/utils/event-utils';
import {
  computeDayGridLanes,
  computeTimedLanes,
  ComputeDayGridLanesPrevious,
  ComputeTimedLanesPrevious,
} from '../internals/utils/lane-positions';
import type { EventCalendarState as State } from '../use-event-calendar';

const EMPTY_DAYS = EMPTY_ARRAY as SchedulerProcessedDate[];

const EMPTY_OCCURRENCES: SchedulerOccurrencesByDay = {
  byKey: new Map(),
  keysByDay: new Map(),
  dayKeys: EMPTY_ARRAY as readonly string[],
};

const EMPTY_DAY_GRID_POSITIONS: SchedulerOccurrencePositions<DayGridContainerLayout> = {
  positionByKey: new Map(),
  byContainer: new Map(),
  maxLane: 1,
};

const EMPTY_TIME_GRID_POSITIONS: SchedulerOccurrencePositions<OccurrenceContainerLayout> = {
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

// `state.viewConfig` is null during the very first render of a view (the view registers
// its config in `useOnMount`, which runs after render). The wrapper selectors below
// guard for that window and return frozen empty values.
const visibleDaysFromConfig = (state: State): SchedulerProcessedDate[] =>
  state.viewConfig?.visibleDaysSelector(state) ?? EMPTY_DAYS;

// Fallback row grouping for views that don't supply a `visibleRowsSelector` — wraps the
// visible days as a single row (the right default for Day/Week, whose day-grid is the
// all-day strip). Memoized so the wrapping array reference is stable.
const fallbackRowsSelector = createSelectorMemoized(
  visibleDaysFromConfig,
  (days): SchedulerProcessedDate[][] => [days],
);

const rowsSelector = (state: State): SchedulerProcessedDate[][] => {
  const customRowsSelector = state.viewConfig?.visibleRowsSelector;
  if (customRowsSelector) {
    return customRowsSelector(state);
  }
  return fallbackRowsSelector(state);
};

// Module-level previous result for visible-occurrences memoization. Reused per-day so
// unchanged days keep the same `keysByDay.get(dayKey)` array reference, enabling
// downstream `computeDayGridLanes` / `computeTimedLanes` to skip recomputing those days.
let previousVisibleOccurrences: SchedulerOccurrencesByDay | null = null;
// Maps each occurrence key to the SchedulerProcessedEvent that produced it. Threaded
// back into `getOccurrencesFromEvents` so unchanged-event occurrences keep their JS
// reference across recomputes — without this, every recompute would spread fresh
// `{ ...event, key }` objects and downstream layout reuse would never trigger.
let previousEventByKey: Map<string, SchedulerProcessedEvent> | null = null;

const defaultVisibleOccurrencesSelector = createSelectorMemoized(
  (s: State) => s.adapter,
  visibleDaysFromConfig,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.displayTimezone,
  schedulerOtherSelectors.plan,
  (adapter, days, events, visibleResources, displayTimezone, plan) => {
    const byKey = new Map<string, SchedulerEventOccurrence>();
    const keysByDay = new Map<string, string[]>();
    const dayKeys: string[] = [];
    for (const day of days) {
      keysByDay.set(day.key, []);
      dayKeys.push(day.key);
    }

    if (days.length === 0) {
      const result = { byKey, keysByDay, dayKeys };
      previousVisibleOccurrences = result;
      previousEventByKey = new Map();
      return result;
    }

    const start = adapter.startOfDay(days[0].value);
    const end = adapter.endOfDay(days[days.length - 1].value);
    const newEventByKey = new Map<string, SchedulerProcessedEvent>();
    const occurrences = getOccurrencesFromEvents({
      adapter,
      start,
      end,
      events,
      visibleResources,
      displayTimezone,
      plan,
      previous:
        previousVisibleOccurrences !== null && previousEventByKey !== null
          ? { byKey: previousVisibleOccurrences.byKey, eventByKey: previousEventByKey }
          : undefined,
      outEventByKey: newEventByKey,
    });

    for (const occurrence of occurrences) {
      byKey.set(occurrence.key, occurrence);
      for (const dayKey of getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter)) {
        keysByDay.get(dayKey)!.push(occurrence.key);
      }
    }

    // Layer 3 reuse: when a day's keys array content matches the previous run's,
    // swap in the previous reference so downstream `arraysShallowEqual` checks
    // short-circuit on identity.
    if (previousVisibleOccurrences !== null) {
      for (const dayKey of dayKeys) {
        const newKeys = keysByDay.get(dayKey)!;
        const oldKeys = previousVisibleOccurrences.keysByDay.get(dayKey);
        if (oldKeys !== undefined && arraysShallowEqual(newKeys, oldKeys)) {
          keysByDay.set(dayKey, oldKeys as string[]);
        }
      }
    }

    const result = { byKey, keysByDay, dayKeys };
    previousVisibleOccurrences = result;
    previousEventByKey = newEventByKey;
    return result;
  },
);

const visibleOccurrencesSelector = (state: State): SchedulerOccurrencesByDay => {
  const config = state.viewConfig;
  if (!config) {
    return EMPTY_OCCURRENCES;
  }
  if (config.visibleOccurrencesSelector) {
    return config.visibleOccurrencesSelector(state);
  }
  return defaultVisibleOccurrencesSelector(state);
};

// Module-level previous result + input. Threaded into `computeDayGridLanes` so unchanged
// rows return the same `DayGridContainerLayout` references (and unchanged occurrences
// keep the same `OccurrenceLanePosition` objects). Stale entries from a previous view
// are detected by `canReuseDayGridRow` and discarded — keeping a stale `previous` is
// only a performance concern (one wasted comparison), never a correctness one.
let previousDayGrid: ComputeDayGridLanesPrevious | null = null;

const defaultDayGridPositionsSelector = createSelectorMemoized(
  (s: State) => s.adapter,
  rowsSelector,
  visibleOccurrencesSelector,
  (s: State) => s.viewConfig?.dayGrid?.shouldAddPosition,
  (adapter, rows, occurrencesByDay, shouldAddPosition) => {
    const result = computeDayGridLanes({
      adapter,
      rows,
      occurrencesByDay,
      shouldAddPosition,
      previous: previousDayGrid,
    });
    previousDayGrid = { result, occurrencesByDay };
    return result;
  },
);

const dayGridPositionsSelector = (
  state: State,
): SchedulerOccurrencePositions<DayGridContainerLayout> => {
  if (!state.viewConfig?.dayGrid) {
    return EMPTY_DAY_GRID_POSITIONS;
  }
  return defaultDayGridPositionsSelector(state);
};

// Module-level previous result + container-key map for per-container reuse in
// `computeTimedLanes`.
let previousTimeGrid: ComputeTimedLanesPrevious | null = null;

const defaultTimeGridPositionsSelector = createSelectorMemoized(
  (s: State) => s.adapter,
  visibleOccurrencesSelector,
  (s: State) => s.viewConfig?.timeGrid?.shouldAddPosition,
  (s: State) => s.viewConfig?.timeGrid?.maxSpan ?? 1,
  (adapter, occurrencesByDay, shouldAddPosition, maxSpan) => {
    const containers: [string, readonly string[]][] = [];
    const containerKeysByContainer = new Map<string, readonly string[]>();
    for (const dayKey of occurrencesByDay.dayKeys) {
      const keys = occurrencesByDay.keysByDay.get(dayKey) ?? EMPTY_ARRAY;
      containers.push([dayKey, keys]);
      containerKeysByContainer.set(dayKey, keys);
    }
    const result = computeTimedLanes({
      adapter,
      occurrencesByKey: occurrencesByDay.byKey,
      containers,
      maxSpan,
      shouldAddPosition,
      previous: previousTimeGrid,
    });
    previousTimeGrid = {
      result,
      occurrencesByKey: occurrencesByDay.byKey,
      containerKeysByContainer,
    };
    return result;
  },
);

const timeGridPositionsSelector = (
  state: State,
): SchedulerOccurrencePositions<OccurrenceContainerLayout> => {
  if (!state.viewConfig?.timeGrid) {
    return EMPTY_TIME_GRID_POSITIONS;
  }
  return defaultTimeGridPositionsSelector(state);
};

export const eventCalendarOccurrencePositionSelectors = {
  visibleOccurrences: visibleOccurrencesSelector,
  occurrenceByKey: createSelector(
    visibleOccurrencesSelector,
    (occurrences, occurrenceKey: string): SchedulerEventOccurrence | null =>
      occurrences.byKey.get(occurrenceKey) ?? null,
  ),
  occurrenceKeysForDay: createSelector(
    visibleOccurrencesSelector,
    (occurrences, dayKey: string): readonly string[] =>
      occurrences.keysByDay.get(dayKey) ?? EMPTY_ARRAY,
  ),

  // Day-grid (Month + all-day strip)
  dayGridPositions: dayGridPositionsSelector,
  dayGridLayoutForDay: createSelector(
    dayGridPositionsSelector,
    (positions, dayKey: string): DayGridContainerLayout | null =>
      positions.byContainer.get(dayKey) ?? null,
  ),
  dayGridPositionByKey: createSelector(
    dayGridPositionsSelector,
    (positions, occurrenceKey: string): OccurrenceLanePosition | null =>
      positions.positionByKey.get(occurrenceKey) ?? null,
  ),
  dayGridMaxLane: createSelector(dayGridPositionsSelector, (positions) => positions.maxLane),

  // Time-grid (Day/Week time area)
  timeGridPositions: timeGridPositionsSelector,
  timeGridLayoutForDay: createSelector(
    timeGridPositionsSelector,
    (positions, dayKey: string): OccurrenceContainerLayout | null =>
      positions.byContainer.get(dayKey) ?? null,
  ),
  timeGridPositionByKey: createSelector(
    timeGridPositionsSelector,
    (positions, occurrenceKey: string): OccurrenceLanePosition | null =>
      positions.positionByKey.get(occurrenceKey) ?? null,
  ),
  timeGridMaxLane: createSelector(timeGridPositionsSelector, (positions) => positions.maxLane),
};
