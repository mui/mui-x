// TODO: Use the Base UI warning utility once it supports cleanup in tests.
import { warnOnce } from '@mui/x-internals/warning';
import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
  SchedulerOccurrencesByDay,
  SchedulerOccurrencePositions,
  OccurrenceLanePosition,
  OccurrenceContainerLayout,
  DayGridContainerLayout,
  DayGridContainerSlot,
} from '../../models';
import { sortEventOccurrences } from '../../sort-event-occurrences';
import type { Adapter } from '../../use-adapter/useAdapter.types';

/**
 * Predicate deciding whether an occurrence should be assigned a lane in a day-grid /
 * time-grid container. Occurrences that return `false` are excluded from the layout
 * entirely (not assigned a lane and not present in the container's `orderedKeys`).
 */
export type ShouldAddPosition = (occurrence: SchedulerEventOccurrence, adapter: Adapter) => boolean;

/**
 * Snapshot of the previous compute call. Passed back in to enable per-row /
 * per-container layout reuse and per-occurrence position interning, so unchanged
 * slices of the calendar return the same JS references and downstream subscriptions
 * short-circuit.
 */
export interface ComputeDayGridLanesPrevious {
  result: SchedulerOccurrencePositions<DayGridContainerLayout>;
  occurrencesByDay: SchedulerOccurrencesByDay;
}

export interface ComputeTimedLanesPrevious {
  result: SchedulerOccurrencePositions<OccurrenceContainerLayout>;
  occurrencesByKey: ReadonlyMap<string, SchedulerEventOccurrence>;
  containerKeysByContainer: ReadonlyMap<string, readonly string[]>;
}

interface DayGridLanesDayWorkBucket {
  orderedKeys: string[];
  positionByKey: Map<string, OccurrenceLanePosition>;
  slotByKey: Map<string, DayGridContainerSlot>;
  usedLanes: Set<number>;
  maxLane: number;
}

/**
 * Day-grid lane assignment.
 *
 * Each `row` is processed independently — a multi-day event that crosses a row boundary
 * (e.g. Sun→Wed in MonthView) restarts its lane on the first day of the next row, so the
 * event renders visibly there. Within a row:
 *  - sort the day's eligible occurrences by start (then by end desc),
 *  - for occurrences that already appeared on the previous day OF THE SAME ROW, reuse
 *    the same lane and mark them as continuation markers,
 *  - otherwise pick the smallest unused lane in the current day.
 *
 * `cellSpan` for a starting cell is `min(durationInDays, daysRemainingInRow)`; on
 * continuation cells it is always 1.
 *
 * When `previous` is provided, every row whose inputs (per-day keys + referenced
 * occurrence objects) are unchanged returns the same `DayGridContainerLayout`
 * references as last time. Within recomputed rows, individual `OccurrenceLanePosition`
 * objects are reused when an occurrence's `(firstLane, lastLane)` is unchanged.
 */
export function computeDayGridLanes(parameters: {
  adapter: Adapter;
  rows: readonly (readonly SchedulerProcessedDate[])[];
  occurrencesByDay: SchedulerOccurrencesByDay;
  shouldAddPosition?: ShouldAddPosition;
  previous?: ComputeDayGridLanesPrevious | null;
}): SchedulerOccurrencePositions<DayGridContainerLayout> {
  const { adapter, rows, occurrencesByDay, shouldAddPosition, previous } = parameters;

  const positionByKey = new Map<string, OccurrenceLanePosition>();
  const byContainer = new Map<string, DayGridContainerLayout>();
  let globalMaxLane = 1;

  // Mutable per-day work buckets — copied to the immutable shape at the end.
  const workBucket: { [dayKey: string]: DayGridLanesDayWorkBucket } = {};

  for (const row of rows) {
    if (canReuseDayGridRow(row, occurrencesByDay, previous)) {
      reuseDayGridRow(row, previous!, byContainer, positionByKey);
      const previousMaxLane = previous!.result.maxLane;
      if (previousMaxLane > globalMaxLane) {
        globalMaxLane = previousMaxLane;
      }
      continue;
    }

    const rowSize = row.length;

    for (let dayIndex = 0; dayIndex < rowSize; dayIndex += 1) {
      const day = row[dayIndex];
      const dayWorkBucket: DayGridLanesDayWorkBucket = {
        orderedKeys: [],
        positionByKey: new Map(),
        slotByKey: new Map(),
        usedLanes: new Set(),
        maxLane: 1,
      };
      workBucket[day.key] = dayWorkBucket;

      const keys = occurrencesByDay.keysByDay.get(day.key) ?? [];

      // 1. Filter occurrences that need a lane. Resolve to occurrence objects via byKey
      //    so the algorithm can rely on `displayTimezone.end` for cellSpan computation.
      const eligible: SchedulerEventOccurrence[] = [];
      for (const key of keys) {
        const occurrence = occurrencesByDay.byKey.get(key);
        if (!occurrence) {
          warnOnce([
            `MUI X Scheduler: occurrence "${key}" referenced by day "${day.key}" is missing from \`occurrencesByDay.byKey\`.`,
            'The occurrence index was built inconsistently; the occurrence is omitted from the layout. ' +
              'Make sure every key listed in `keysByDay` resolves in `byKey`.',
          ]);
          continue;
        }
        const eligibleForLane = shouldAddPosition ? shouldAddPosition(occurrence, adapter) : true;
        if (eligibleForLane) {
          eligible.push(occurrence);
        }
      }

      // 2. Sort and assign lanes.
      const sorted = sortEventOccurrences(eligible);
      for (const occurrence of sorted) {
        // Look at the previous day in THE SAME ROW. The first day of a row never
        // continues from a previous day, even if the calendar was contiguous.
        const previousDayKey = dayIndex === 0 ? null : row[dayIndex - 1].key;
        const previousLane =
          previousDayKey != null
            ? workBucket[previousDayKey]?.positionByKey.get(occurrence.key)?.firstLane
            : undefined;

        let lane: number;
        let cellSpan: number;
        let isInvisible = false;
        if (previousLane != null) {
          // Multi-day continuation within the row: reuse the lane, mark invisible.
          lane = previousLane;
          cellSpan = 1;
          isInvisible = true;
        } else {
          let candidate = 1;
          while (dayWorkBucket.usedLanes.has(candidate)) {
            candidate += 1;
          }
          lane = candidate;
          const durationInDays =
            adapter.differenceInDays(occurrence.displayTimezone.end.value, day.value) + 1;
          // Clamp to >= 1 — an occurrence visible on this day always spans at least one
          // cell, even if its data is malformed (e.g. end < start on an in-flight resize).
          cellSpan = Math.max(1, Math.min(durationInDays, rowSize - dayIndex));
        }

        const position = internPosition(previous?.result.positionByKey, occurrence.key, lane, lane);
        dayWorkBucket.positionByKey.set(occurrence.key, position);
        dayWorkBucket.slotByKey.set(
          occurrence.key,
          internDayGridSlot(
            previous?.result.byContainer.get(day.key)?.slotByKey,
            occurrence.key,
            position,
            cellSpan,
            isInvisible,
          ),
        );
        dayWorkBucket.usedLanes.add(lane);
        if (!isInvisible && !positionByKey.has(occurrence.key)) {
          // Register a global position on the FIRST visible cell of the run only.
          // (Multi-row events get one entry per row they appear in; we keep the leftmost.)
          positionByKey.set(occurrence.key, position);
        }
        dayWorkBucket.orderedKeys.push(occurrence.key);
        if (lane > dayWorkBucket.maxLane) {
          dayWorkBucket.maxLane = lane;
        }
        if (lane > globalMaxLane) {
          globalMaxLane = lane;
        }
      }

      // 3. Sort by lane so events stack visually top-to-bottom (lane 1 first).
      const positionByKeyForSort = dayWorkBucket.positionByKey;
      dayWorkBucket.orderedKeys.sort(
        (a, b) =>
          (positionByKeyForSort.get(a)?.firstLane ?? 0) -
          (positionByKeyForSort.get(b)?.firstLane ?? 0),
      );
    }

    for (const day of row) {
      const dayWorkBucket = workBucket[day.key];
      byContainer.set(day.key, {
        orderedKeys: dayWorkBucket.orderedKeys,
        positionByKey: dayWorkBucket.positionByKey,
        slotByKey: dayWorkBucket.slotByKey,
        usedLanes: dayWorkBucket.usedLanes,
        maxLane: dayWorkBucket.maxLane,
      });
    }
  }

  return { positionByKey, byContainer, maxLane: globalMaxLane };
}

/**
 * Time-grid / timeline lane assignment.
 *
 * For each container, build a conflict graph between overlapping occurrences (grouped
 * into non-overlapping blocks for cheap pairwise comparisons), then pick the smallest
 * lane that doesn't collide with any "before" conflict. If `maxSpan > 1`, expand the
 * lane rightwards into unused slots until either `maxSpan` is hit or another
 * occurrence's lane is encountered.
 *
 * The `containers` argument is a list of (containerKey, occurrenceKeys) pairs — in the
 * Calendar this is per-day, in the Timeline it's per-resource.
 *
 * When `previous` is provided, every container whose `keys` array AND every referenced
 * occurrence object are unchanged returns the same `OccurrenceContainerLayout` reference
 * as last time. Within recomputed containers, individual `OccurrenceLanePosition`
 * objects are reused when their `(firstLane, lastLane)` is unchanged.
 */
export function computeTimedLanes(parameters: {
  adapter: Adapter;
  occurrencesByKey: ReadonlyMap<string, SchedulerEventOccurrence>;
  containers: ReadonlyArray<readonly [string, readonly string[]]>;
  maxSpan?: number;
  shouldAddPosition?: ShouldAddPosition;
  previous?: ComputeTimedLanesPrevious | null;
}): SchedulerOccurrencePositions<OccurrenceContainerLayout> {
  const {
    adapter,
    occurrencesByKey,
    containers,
    maxSpan = 1,
    shouldAddPosition,
    previous,
  } = parameters;

  let effectiveMaxSpan = maxSpan;
  if (maxSpan < 1) {
    warnOnce([
      `MUI X Scheduler: \`maxSpan\` must be >= 1 (received ${maxSpan}).`,
      "Falling back to maxSpan=1. Set the view config's `timeGrid.maxSpan` to a positive integer (or omit it to default to 1).",
    ]);
    effectiveMaxSpan = 1;
  }

  const positionByKey = new Map<string, OccurrenceLanePosition>();
  const byContainer = new Map<string, OccurrenceContainerLayout>();
  let globalMaxLane = 1;

  for (const [containerKey, keys] of containers) {
    if (canReuseTimedContainer(containerKey, keys, occurrencesByKey, previous)) {
      const reusedLayout = previous!.result.byContainer.get(containerKey)!;
      byContainer.set(containerKey, reusedLayout);
      for (const [k, pos] of reusedLayout.positionByKey) {
        positionByKey.set(k, pos);
      }
      if (reusedLayout.maxLane > globalMaxLane) {
        globalMaxLane = reusedLayout.maxLane;
      }
      continue;
    }

    const eligible: SchedulerEventOccurrence[] = [];
    for (const key of keys) {
      const occurrence = occurrencesByKey.get(key);
      if (!occurrence) {
        warnOnce([
          `MUI X Scheduler: occurrence "${key}" referenced by container "${containerKey}" is missing from \`occurrencesByKey\`.`,
          'The occurrence index was built inconsistently; the occurrence is omitted from the layout. ' +
            'Make sure every key listed for a container resolves in `occurrencesByKey`.',
        ]);
        continue;
      }
      const eligibleForLane = shouldAddPosition ? shouldAddPosition(occurrence, adapter) : true;
      if (eligibleForLane) {
        eligible.push(occurrence);
      }
    }

    const sorted = sortEventOccurrences(eligible);
    const conflicts = buildOccurrenceConflicts(sorted);
    const { firstLaneByKey, maxLane: containerMaxLane } = buildFirstLaneByKey(conflicts);
    const lastLaneByKey = buildLastLaneByKey(
      conflicts,
      firstLaneByKey,
      containerMaxLane,
      effectiveMaxSpan,
    );

    const layout: {
      orderedKeys: string[];
      positionByKey: Map<string, OccurrenceLanePosition>;
      usedLanes: Set<number>;
      maxLane: number;
    } = {
      orderedKeys: [],
      positionByKey: new Map(),
      usedLanes: new Set(),
      maxLane: containerMaxLane,
    };

    for (const occurrence of sorted) {
      const firstLane = firstLaneByKey[occurrence.key];
      const lastLane = lastLaneByKey[occurrence.key];
      // Invariant: lane assignment must satisfy `1 <= firstLane <= lastLane`.
      // Crashes loudly in dev if a future change to `buildFirstLaneByKey` /
      // `buildLastLaneByKey` violates that contract.
      if (process.env.NODE_ENV !== 'production' && (firstLane < 1 || lastLane < firstLane)) {
        throw new Error(
          `MUI X Scheduler: invalid lane assignment for occurrence "${occurrence.key}" in container "${containerKey}": ` +
            `firstLane=${firstLane}, lastLane=${lastLane}. Expected 1 <= firstLane <= lastLane. ` +
            `This is a bug in \`buildFirstLaneByKey\`/\`buildLastLaneByKey\`.`,
        );
      }
      const position = internPosition(
        previous?.result.positionByKey,
        occurrence.key,
        firstLane,
        lastLane,
      );
      layout.positionByKey.set(occurrence.key, position);
      for (let lane = firstLane; lane <= lastLane; lane += 1) {
        layout.usedLanes.add(lane);
      }
      layout.orderedKeys.push(occurrence.key);
      positionByKey.set(occurrence.key, position);
    }

    const layoutPositionByKey = layout.positionByKey;
    layout.orderedKeys.sort(
      (a, b) =>
        (layoutPositionByKey.get(a)?.firstLane ?? 0) - (layoutPositionByKey.get(b)?.firstLane ?? 0),
    );

    byContainer.set(containerKey, layout);
    if (containerMaxLane > globalMaxLane) {
      globalMaxLane = containerMaxLane;
    }
  }

  return { positionByKey, byContainer, maxLane: globalMaxLane };
}

/**
 * Reuse an existing `OccurrenceLanePosition` object when its `(firstLane, lastLane)`
 * is unchanged, so downstream `dayGridPositionByKey(key)` subscriptions short-circuit.
 */
function internPosition(
  previousPositions: ReadonlyMap<string, OccurrenceLanePosition> | undefined,
  key: string,
  firstLane: number,
  lastLane: number,
): OccurrenceLanePosition {
  const prev = previousPositions?.get(key);
  if (prev !== undefined && prev.firstLane === firstLane && prev.lastLane === lastLane) {
    return prev;
  }
  return { firstLane, lastLane };
}

/**
 * Reuse an existing `DayGridContainerSlot` when its fields are unchanged, so consumers
 * doing `slotByKey.get(key)` get a stable reference across re-renders.
 */
function internDayGridSlot(
  previousSlots: ReadonlyMap<string, DayGridContainerSlot> | undefined,
  key: string,
  position: OccurrenceLanePosition,
  cellSpan: number,
  isInvisible: boolean,
): DayGridContainerSlot {
  const prev = previousSlots?.get(key);
  if (
    prev !== undefined &&
    prev.firstLane === position.firstLane &&
    prev.lastLane === position.lastLane &&
    prev.cellSpan === cellSpan &&
    prev.isInvisible === isInvisible
  ) {
    return prev;
  }
  return { firstLane: position.firstLane, lastLane: position.lastLane, cellSpan, isInvisible };
}

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
 * A row's day-grid layouts can be reused when every day in the row has the same
 * occurrence keys (in the same order) AND every referenced occurrence object is
 * reference-equal to its previous version. Lane assignment within a row depends on
 * cross-day continuation, so this check has to be all-or-nothing per row.
 */
function canReuseDayGridRow(
  row: readonly SchedulerProcessedDate[],
  current: SchedulerOccurrencesByDay,
  previous: ComputeDayGridLanesPrevious | null | undefined,
): boolean {
  if (!previous) {
    return false;
  }
  for (const day of row) {
    if (!previous.result.byContainer.has(day.key)) {
      return false;
    }
    const newKeys = current.keysByDay.get(day.key);
    const oldKeys = previous.occurrencesByDay.keysByDay.get(day.key);
    if (newKeys === undefined || oldKeys === undefined) {
      return false;
    }
    if (!arraysShallowEqual(newKeys, oldKeys)) {
      return false;
    }
    for (const key of newKeys) {
      if (current.byKey.get(key) !== previous.occurrencesByDay.byKey.get(key)) {
        return false;
      }
    }
  }
  return true;
}

function reuseDayGridRow(
  row: readonly SchedulerProcessedDate[],
  previous: ComputeDayGridLanesPrevious,
  byContainer: Map<string, DayGridContainerLayout>,
  positionByKey: Map<string, OccurrenceLanePosition>,
): void {
  for (const day of row) {
    const reusedLayout = previous.result.byContainer.get(day.key)!;
    byContainer.set(day.key, reusedLayout);
    // Re-register global positions for occurrences whose first visible cell falls
    // in this row (mirrors the leftmost-cell rule used during fresh compute).
    for (const key of reusedLayout.orderedKeys) {
      const slot = reusedLayout.slotByKey.get(key);
      if (slot === undefined || slot.isInvisible) {
        continue;
      }
      if (!positionByKey.has(key)) {
        positionByKey.set(key, reusedLayout.positionByKey.get(key)!);
      }
    }
  }
}

/**
 * A timed container's layout can be reused when its `keys` array (in the same order)
 * AND every referenced occurrence object are reference-equal to their previous version.
 */
function canReuseTimedContainer(
  containerKey: string,
  newKeys: readonly string[],
  current: ReadonlyMap<string, SchedulerEventOccurrence>,
  previous: ComputeTimedLanesPrevious | null | undefined,
): boolean {
  if (!previous) {
    return false;
  }
  if (!previous.result.byContainer.has(containerKey)) {
    return false;
  }
  const oldKeys = previous.containerKeysByContainer.get(containerKey);
  if (oldKeys === undefined) {
    return false;
  }
  if (!arraysShallowEqual(newKeys, oldKeys)) {
    return false;
  }
  for (const key of newKeys) {
    if (current.get(key) !== previous.occurrencesByKey.get(key)) {
      return false;
    }
  }
  return true;
}

/**
 * Group occurrences into non-overlapping blocks and, within each block, build the
 * before/after conflict sets needed to assign lanes.
 */
function buildOccurrenceConflicts(
  occurrences: readonly SchedulerEventOccurrence[],
): OccurrenceConflicts[] {
  const blocks: OccurrenceBlock[] = [];
  let currentBlock: OccurrenceBlock = { occurrences: [], longestDurationMs: 0 };
  let lastEndTimestamp = 0;

  for (const occurrence of occurrences) {
    const startTimestamp = occurrence.displayTimezone.start.timestamp;
    const endTimestamp = occurrence.displayTimezone.end.timestamp;
    const durationMs = endTimestamp - startTimestamp;

    if (startTimestamp >= lastEndTimestamp) {
      if (currentBlock.occurrences.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = { occurrences: [], longestDurationMs: 0 };
      lastEndTimestamp = 0;
    }

    currentBlock.occurrences.push({ key: occurrence.key, startTimestamp, endTimestamp });

    if (durationMs > currentBlock.longestDurationMs) {
      currentBlock.longestDurationMs = durationMs;
    }
    if (endTimestamp > lastEndTimestamp) {
      lastEndTimestamp = endTimestamp;
    }
  }
  if (currentBlock.occurrences.length > 0) {
    blocks.push(currentBlock);
  }

  const conflicts: OccurrenceConflicts[] = [];
  for (const block of blocks) {
    for (let i = 0; i < block.occurrences.length; i += 1) {
      const occurrence = block.occurrences[i];
      const before = new Set<string>();
      const after = new Set<string>();

      for (let j = i + 1; j < block.occurrences.length; j += 1) {
        const other = block.occurrences[j];
        if (other.startTimestamp < occurrence.endTimestamp) {
          after.add(other.key);
        } else {
          break;
        }
      }

      for (let j = i - 1; j >= 0; j -= 1) {
        const other = block.occurrences[j];
        const distance = occurrence.startTimestamp - other.startTimestamp;
        if (distance > block.longestDurationMs) {
          break;
        }
        if (other.endTimestamp > occurrence.startTimestamp) {
          before.add(other.key);
        }
      }

      conflicts.push({ key: occurrence.key, before, after });
    }
  }

  return conflicts;
}

function buildFirstLaneByKey(conflicts: readonly OccurrenceConflicts[]): {
  firstLaneByKey: { [occurrenceKey: string]: number };
  maxLane: number;
} {
  let maxLane = 1;
  const firstLaneByKey: { [occurrenceKey: string]: number } = {};

  for (const occurrence of conflicts) {
    if (occurrence.before.size === 0) {
      firstLaneByKey[occurrence.key] = 1;
    } else {
      const used = new Set<number>();
      for (const conflictingKey of occurrence.before) {
        used.add(firstLaneByKey[conflictingKey]);
      }
      let candidate = 1;
      while (used.has(candidate)) {
        candidate += 1;
      }
      firstLaneByKey[occurrence.key] = candidate;
      if (candidate > maxLane) {
        maxLane = candidate;
      }
    }
  }

  return { firstLaneByKey, maxLane };
}

function buildLastLaneByKey(
  conflicts: readonly OccurrenceConflicts[],
  firstLaneByKey: { [occurrenceKey: string]: number },
  maxLane: number,
  maxSpan: number,
): { [occurrenceKey: string]: number } {
  if (maxSpan < 2) {
    return firstLaneByKey;
  }

  const lastLaneByKey: { [occurrenceKey: string]: number } = {};
  for (const occurrence of conflicts) {
    const used = new Set<number>();
    for (const conflictingKey of occurrence.before) {
      used.add(firstLaneByKey[conflictingKey]);
    }
    for (const conflictingKey of occurrence.after) {
      used.add(firstLaneByKey[conflictingKey]);
    }
    const firstLane = firstLaneByKey[occurrence.key];
    let lastLane = firstLane;
    while (!used.has(lastLane + 1) && lastLane < maxLane && lastLane - firstLane < maxSpan - 1) {
      lastLane += 1;
    }
    lastLaneByKey[occurrence.key] = lastLane;
  }
  return lastLaneByKey;
}

interface OccurrenceBlock {
  occurrences: { key: string; startTimestamp: number; endTimestamp: number }[];
  longestDurationMs: number;
}

interface OccurrenceConflicts {
  key: string;
  before: Set<string>;
  after: Set<string>;
}
