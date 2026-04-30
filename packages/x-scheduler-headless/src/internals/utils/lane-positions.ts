import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
  SchedulerOccurrencesByDay,
  SchedulerOccurrencePositions,
  OccurrenceLanePosition,
  OccurrenceContainerLayout,
  DayGridContainerLayout,
} from '../../models';
import { sortEventOccurrences } from '../../sort-event-occurrences';
import type { Adapter } from '../../use-adapter/useAdapter.types';

/**
 * Predicate deciding whether an occurrence should be assigned a lane in a day-grid /
 * time-grid container. Occurrences that return `false` are tracked for visibility but
 * carry no lane.
 */
export type ShouldAddPosition = (occurrence: SchedulerEventOccurrence, adapter: Adapter) => boolean;

interface DayGridLanesDayWorkBucket {
  orderedKeys: string[];
  positionByKey: Map<string, OccurrenceLanePosition>;
  cellSpanByKey: Map<string, number>;
  invisibleKeys: Set<string>;
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
 */
export function computeDayGridLanes(parameters: {
  adapter: Adapter;
  rows: readonly (readonly SchedulerProcessedDate[])[];
  occurrencesByDay: SchedulerOccurrencesByDay;
  shouldAddPosition?: ShouldAddPosition;
}): SchedulerOccurrencePositions<DayGridContainerLayout> {
  const { adapter, rows, occurrencesByDay, shouldAddPosition } = parameters;

  const positionByKey = new Map<string, OccurrenceLanePosition>();
  const byContainer = new Map<string, DayGridContainerLayout>();
  let globalMaxLane = 1;

  // Mutable per-day work buckets — copied to the immutable shape at the end.
  const workBucket: { [dayKey: string]: DayGridLanesDayWorkBucket } = {};

  for (const row of rows) {
    const rowSize = row.length;

    for (let dayIndex = 0; dayIndex < rowSize; dayIndex += 1) {
      const day = row[dayIndex];
      const dayWorkBucket: DayGridLanesDayWorkBucket = {
        orderedKeys: [],
        positionByKey: new Map(),
        cellSpanByKey: new Map(),
        invisibleKeys: new Set(),
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
          cellSpan = Math.min(durationInDays, rowSize - dayIndex);
        }

        const position: OccurrenceLanePosition = { firstLane: lane, lastLane: lane };
        dayWorkBucket.positionByKey.set(occurrence.key, position);
        dayWorkBucket.cellSpanByKey.set(occurrence.key, cellSpan);
        dayWorkBucket.usedLanes.add(lane);
        if (isInvisible) {
          dayWorkBucket.invisibleKeys.add(occurrence.key);
        } else if (!positionByKey.has(occurrence.key)) {
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

      // 3. Sort orderedKeys by lane so render order matches the previous algorithm.
      dayWorkBucket.orderedKeys.sort(
        (a, b) =>
          dayWorkBucket.positionByKey.get(a)!.firstLane -
          dayWorkBucket.positionByKey.get(b)!.firstLane,
      );
    }

    for (const day of row) {
      const dayWorkBucket = workBucket[day.key];
      byContainer.set(day.key, {
        orderedKeys: dayWorkBucket.orderedKeys,
        positionByKey: dayWorkBucket.positionByKey,
        cellSpanByKey: dayWorkBucket.cellSpanByKey,
        invisibleKeys: dayWorkBucket.invisibleKeys,
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
 */
export function computeTimedLanes(parameters: {
  adapter: Adapter;
  occurrencesByKey: ReadonlyMap<string, SchedulerEventOccurrence>;
  containers: ReadonlyArray<readonly [string, readonly string[]]>;
  maxSpan?: number;
  shouldAddPosition?: ShouldAddPosition;
}): SchedulerOccurrencePositions<OccurrenceContainerLayout> {
  const { adapter, occurrencesByKey, containers, maxSpan = 1, shouldAddPosition } = parameters;

  const positionByKey = new Map<string, OccurrenceLanePosition>();
  const byContainer = new Map<string, OccurrenceContainerLayout>();
  let globalMaxLane = 1;

  for (const [containerKey, keys] of containers) {
    const eligible: SchedulerEventOccurrence[] = [];
    for (const key of keys) {
      const occurrence = occurrencesByKey.get(key);
      if (!occurrence) {
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
    const lastLaneByKey = buildLastLaneByKey(conflicts, firstLaneByKey, containerMaxLane, maxSpan);

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
      const position: OccurrenceLanePosition = { firstLane, lastLane };
      layout.positionByKey.set(occurrence.key, position);
      layout.usedLanes.add(firstLane);
      layout.orderedKeys.push(occurrence.key);
      positionByKey.set(occurrence.key, position);
    }

    layout.orderedKeys.sort(
      (a, b) => layout.positionByKey.get(a)!.firstLane - layout.positionByKey.get(b)!.firstLane,
    );

    byContainer.set(containerKey, layout);
    if (containerMaxLane > globalMaxLane) {
      globalMaxLane = containerMaxLane;
    }
  }

  return { positionByKey, byContainer, maxLane: globalMaxLane };
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
