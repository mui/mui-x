import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EMPTY_ARRAY } from '@base-ui/utils/empty';
import type {
  EventCalendarShouldAddPosition,
  EventCalendarViewConfig,
  SchedulerEventOccurrence,
  SchedulerOccurrencesByDay,
  SchedulerOccurrencePositions,
  OccurrenceContainerLayout,
  DayGridContainerLayout,
  OccurrenceLanePosition,
  SchedulerProcessedDate,
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
import { computeDayGridLanes, computeTimedLanes } from '../internals/utils/lane-positions';
import type { EventCalendarState as State } from '../use-event-calendar';

/**
 * Per-config cache for the lazily-built memoized selectors.
 *
 * Each view config object owns one set of selectors — built on first read and reused
 * for every subsequent read until the config is unmounted (at which point the WeakMap
 * entry becomes GC-eligible).
 */
interface ConfigCache {
  visibleOccurrences: (state: State) => SchedulerOccurrencesByDay;
  dayGridPositions: ((state: State) => SchedulerOccurrencePositions<DayGridContainerLayout>) | null;
  timeGridPositions:
    | ((state: State) => SchedulerOccurrencePositions<OccurrenceContainerLayout>)
    | null;
}
const configCache = new WeakMap<EventCalendarViewConfig, ConfigCache>();

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

function buildVisibleOccurrencesSelector(
  visibleDaysSelector: (state: State) => SchedulerProcessedDate[],
): (state: State) => SchedulerOccurrencesByDay {
  return createSelectorMemoized(
    (s: State) => s.adapter,
    visibleDaysSelector,
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
        return { byKey, keysByDay, dayKeys };
      }

      const start = adapter.startOfDay(days[0].value);
      const end = adapter.endOfDay(days[days.length - 1].value);
      const occurrences = getOccurrencesFromEvents({
        adapter,
        start,
        end,
        events,
        visibleResources,
        displayTimezone,
        plan,
      });

      for (const occurrence of occurrences) {
        byKey.set(occurrence.key, occurrence);
        for (const dayKey of getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter)) {
          keysByDay.get(dayKey)!.push(occurrence.key);
        }
      }

      return { byKey, keysByDay, dayKeys };
    },
  );
}

function buildDayGridPositionsSelector(parameters: {
  visibleDaysSelector: (state: State) => SchedulerProcessedDate[];
  visibleRowsSelector?: (state: State) => SchedulerProcessedDate[][];
  visibleOccurrencesSelector: (state: State) => SchedulerOccurrencesByDay;
  shouldAddPosition?: EventCalendarShouldAddPosition;
}): (state: State) => SchedulerOccurrencePositions<DayGridContainerLayout> {
  const { visibleDaysSelector, visibleRowsSelector, visibleOccurrencesSelector, shouldAddPosition } =
    parameters;

  const rowsSelector =
    visibleRowsSelector ??
    createSelectorMemoized(visibleDaysSelector, (days) => [days]);

  return createSelectorMemoized(
    (s: State) => s.adapter,
    rowsSelector,
    visibleOccurrencesSelector,
    (adapter, rows, occurrencesByDay) =>
      computeDayGridLanes({ adapter, rows, occurrencesByDay, shouldAddPosition }),
  );
}

function buildTimeGridPositionsSelector(parameters: {
  visibleOccurrencesSelector: (state: State) => SchedulerOccurrencesByDay;
  shouldAddPosition?: EventCalendarShouldAddPosition;
  maxSpan?: number;
}): (state: State) => SchedulerOccurrencePositions<OccurrenceContainerLayout> {
  const { visibleOccurrencesSelector, shouldAddPosition, maxSpan = 1 } = parameters;
  return createSelectorMemoized(
    (s: State) => s.adapter,
    visibleOccurrencesSelector,
    (adapter, occurrencesByDay) => {
      const containers: [string, readonly string[]][] = [];
      for (const dayKey of occurrencesByDay.dayKeys) {
        containers.push([dayKey, occurrencesByDay.keysByDay.get(dayKey) ?? []]);
      }
      return computeTimedLanes({
        adapter,
        occurrencesByKey: occurrencesByDay.byKey,
        containers,
        maxSpan,
        shouldAddPosition,
      });
    },
  );
}

function getConfigCache(config: EventCalendarViewConfig): ConfigCache {
  const cached = configCache.get(config);
  if (cached) {
    return cached;
  }
  const visibleOccurrences =
    config.visibleOccurrencesSelector ??
    buildVisibleOccurrencesSelector(config.visibleDaysSelector);
  const dayGridPositions = config.dayGrid
    ? buildDayGridPositionsSelector({
        visibleDaysSelector: config.visibleDaysSelector,
        visibleRowsSelector: config.visibleRowsSelector,
        visibleOccurrencesSelector: visibleOccurrences,
        shouldAddPosition: config.dayGrid.shouldAddPosition,
      })
    : null;
  const timeGridPositions = config.timeGrid
    ? buildTimeGridPositionsSelector({
        visibleOccurrencesSelector: visibleOccurrences,
        shouldAddPosition: config.timeGrid.shouldAddPosition,
        maxSpan: config.timeGrid.maxSpan,
      })
    : null;
  const entry: ConfigCache = { visibleOccurrences, dayGridPositions, timeGridPositions };
  configCache.set(config, entry);
  return entry;
}

const visibleOccurrencesSelector = (state: State): SchedulerOccurrencesByDay => {
  const config = state.viewConfig;
  if (!config) {
    return EMPTY_OCCURRENCES;
  }
  return getConfigCache(config).visibleOccurrences(state);
};

const dayGridPositionsSelector = (
  state: State,
): SchedulerOccurrencePositions<DayGridContainerLayout> => {
  const config = state.viewConfig;
  if (!config) {
    return EMPTY_DAY_GRID_POSITIONS;
  }
  const built = getConfigCache(config).dayGridPositions;
  return built ? built(state) : EMPTY_DAY_GRID_POSITIONS;
};

const timeGridPositionsSelector = (
  state: State,
): SchedulerOccurrencePositions<OccurrenceContainerLayout> => {
  const config = state.viewConfig;
  if (!config) {
    return EMPTY_TIME_GRID_POSITIONS;
  }
  const built = getConfigCache(config).timeGridPositions;
  return built ? built(state) : EMPTY_TIME_GRID_POSITIONS;
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
