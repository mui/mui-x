import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEventId,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import { normalizeAllDayBounds } from '@mui/x-scheduler-internals/internals';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerDependency } from '../../models';

export interface ComputeAutoSchedulingCascadeParameters {
  adapter: Adapter;
  /**
   * The processed events currently in the store, keyed by id.
   */
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>;
  /**
   * The active dependencies grouped by `source`
   * (`eventTimelinePremiumDependencySelectors.activeModelListBySource`).
   */
  activeDependenciesBySource: Map<SchedulerEventId, SchedulerDependency[]>;
  /**
   * The active dependencies grouped by `target`
   * (`eventTimelinePremiumDependencySelectors.activeModelListByTarget`).
   */
  activeDependenciesByTarget: Map<SchedulerEventId, SchedulerDependency[]>;
  isEventReadOnly: (eventId: SchedulerEventId) => boolean;
  /**
   * The `updated` entries of the `updateEvents` batch being applied.
   */
  updated: readonly SchedulerEventUpdatedProperties[];
  /**
   * The ids deleted in the same batch. Deleted events are never cascaded into.
   */
  deleted: ReadonlySet<SchedulerEventId>;
}

interface ResolvedDates {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  startTimestamp: number;
  endTimestamp: number;
  allDay: boolean;
}

export interface AutoSchedulingCascadeResult {
  /**
   * The extra `{ id, start, end }` updates restoring the FS constraints.
   */
  updated: SchedulerEventUpdatedProperties[];
  /**
   * Read-only events the cascade would have moved: the constraint cannot be restored,
   * so the caller should reject the batch.
   */
  blocked: SchedulerEventId[];
}

/**
 * Computes the Finish-to-Start cascade for an `updateEvents` batch: the extra
 * `{ id, start, end }` updates restoring `successor.start >= predecessor.end`, transitively.
 *
 * Push-only: events only move later, and pre-existing violations stay as-is. A seed whose
 * entry moves `start` is being placed by the user and is clamped forward by all its
 * predecessors; everything else is pushed only by predecessors moved in the same batch.
 * Timed events keep their duration (a start resize keeps its end instead), all-day events
 * shift by whole days, and a read-only event that would need to move is reported in
 * `blocked` so the caller rejects the batch.
 *
 * Kahn pass over the subgraph reachable from the seeds. Cycles in the props data warn in
 * dev: a seedless cycle stays unmoved, a cycle through a seed is broken at that seed.
 * Only loaded events take part: with lazy loading, an unfetched successor is not pushed.
 */
export function computeAutoSchedulingCascade(
  parameters: ComputeAutoSchedulingCascadeParameters,
): AutoSchedulingCascadeResult {
  const {
    adapter,
    processedEventLookup,
    activeDependenciesBySource,
    activeDependenciesByTarget,
    isEventReadOnly,
    deleted,
  } = parameters;

  const newDates = new Map<SchedulerEventId, ResolvedDates>();
  // Turning recurring in this batch: the active index predates the update and still
  // lists the event.
  const becomesRecurring = new Set<SchedulerEventId>();
  // Seeds whose entry actually moves `start`: the user is placing them, so they are
  // the ones clamped. Checked against the current start: an entry can carry the same
  // dates (a drop released in place, an API call) and those place nothing.
  const repositionedSeeds = new Set<SchedulerEventId>();
  // Repositioned seeds whose entry left `end` where it is (a start resize): the clamp
  // keeps their end.
  const startResizedSeeds = new Set<SchedulerEventId>();
  // Events whose dates change in this pass; only these push their successors.
  const movedIds = new Set<SchedulerEventId>();

  // Whole-entry last-wins per id, mirroring the store's fold.
  const lastEntryById = new Map<SchedulerEventId, SchedulerEventUpdatedProperties>();
  for (const entry of parameters.updated) {
    lastEntryById.set(entry.id, entry);
  }

  for (const entry of lastEntryById.values()) {
    if (deleted.has(entry.id)) {
      continue;
    }
    if (entry.rrule != null) {
      becomesRecurring.add(entry.id);
      continue;
    }
    if (entry.start == null && entry.end == null && entry.allDay == null) {
      continue;
    }
    const processedEvent = processedEventLookup.get(entry.id);
    if (processedEvent === undefined) {
      // Not loaded (lazy loading): its dependencies are inactive anyway.
      continue;
    }
    const allDay = entry.allDay ?? processedEvent.allDay ?? false;
    // Entries arrive in the display timezone and the store applies them in the data
    // timezone (`dateToEventString`): compare and normalize there.
    const dataTimezone = processedEvent.modelInBuiltInFormat.timezone ?? 'default';
    const { start, end } = normalizeAllDayBounds(
      adapter,
      entry.start == null
        ? processedEvent.dataTimezone.start.value
        : adapter.setTimezone(entry.start, dataTimezone),
      entry.end == null
        ? processedEvent.dataTimezone.end.value
        : adapter.setTimezone(entry.end, dataTimezone),
      allDay,
    );
    const startTimestamp = adapter.getTime(start);
    const endTimestamp = adapter.getTime(end);
    newDates.set(entry.id, { start, end, startTimestamp, endTimestamp, allDay });

    const current = resolveCurrentDates(entry.id)!;
    const startMoved = startTimestamp !== current.startTimestamp;
    if (startMoved || endTimestamp !== current.endTimestamp) {
      movedIds.add(entry.id);
    }
    if (entry.start != null && startMoved) {
      repositionedSeeds.add(entry.id);
      if (endTimestamp === current.endTimestamp) {
        startResizedSeeds.add(entry.id);
      }
    }
  }

  const blocked: SchedulerEventId[] = [];

  if (newDates.size === 0) {
    return { updated: [], blocked };
  }

  const seeds = new Set(newDates.keys());

  // Subgraph reachable from the seeds, visiting each node and edge once.
  const members = new Set<SchedulerEventId>(seeds);
  const inDegree = new Map<SchedulerEventId, number>();
  const discovery = [...seeds];
  while (discovery.length > 0) {
    const eventId = discovery.pop()!;
    for (const dependency of activeDependenciesBySource.get(eventId) ?? []) {
      const { target } = dependency;
      if (deleted.has(target) || becomesRecurring.has(target)) {
        continue;
      }
      inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
      if (!members.has(target)) {
        members.add(target);
        discovery.push(target);
      }
    }
  }

  const ready: SchedulerEventId[] = [];
  for (const seedId of seeds) {
    if ((inDegree.get(seedId) ?? 0) === 0) {
      ready.push(seedId);
    }
  }
  const processed = new Set<SchedulerEventId>();
  const cascaded: SchedulerEventUpdatedProperties[] = [];
  while (processed.size < members.size) {
    if (ready.length === 0) {
      // Every remaining member waits on a cycle. A seed on it can still settle (its
      // dates are the user's), so the stall breaks there; a seedless cycle stays unmoved.
      const stalledSeed = [...seeds].find((seedId) => !processed.has(seedId));
      if (stalledSeed === undefined) {
        break;
      }
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X Scheduler: The dependencies provided via props contain a cycle through an updated event.',
          'Auto-scheduling processed the updated event with the cycle unresolved, so its members may keep violating each other.',
          'Fix the `dependencies` data — `addDependency()` rejects dependencies that would create a cycle.',
        ]);
      }
      ready.push(stalledSeed);
    }
    const eventId = ready.pop()!;
    if (processed.has(eventId)) {
      // A force-broken seed can still reach in-degree 0 afterwards.
      continue;
    }
    processed.add(eventId);

    const shifted = computeShift(eventId);
    if (shifted !== null) {
      newDates.set(eventId, shifted);
      movedIds.add(eventId);
      cascaded.push({ id: eventId, start: shifted.start, end: shifted.end });
    }

    for (const dependency of activeDependenciesBySource.get(eventId) ?? []) {
      const { target } = dependency;
      if (!members.has(target)) {
        continue;
      }
      const remaining = inDegree.get(target)! - 1;
      inDegree.set(target, remaining);
      if (remaining === 0 && !processed.has(target)) {
        ready.push(target);
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    if (processed.size < members.size) {
      warnOnce([
        'MUI X Scheduler: The dependencies provided via props contain a cycle.',
        'Auto-scheduling left the events on the cycle (and the ones behind it) unmoved.',
        'Fix the `dependencies` data — `addDependency()` rejects dependencies that would create a cycle.',
      ]);
    }
  }

  return { updated: cascaded, blocked };

  function resolveCurrentDates(eventId: SchedulerEventId): ResolvedDates | null {
    const processedEvent = processedEventLookup.get(eventId);
    if (processedEvent === undefined) {
      return null;
    }
    const { start, end } = normalizeAllDayBounds(
      adapter,
      processedEvent.dataTimezone.start.value,
      processedEvent.dataTimezone.end.value,
      processedEvent.allDay,
    );
    return {
      start,
      end,
      startTimestamp: adapter.getTime(start),
      endTimestamp: adapter.getTime(end),
      allDay: processedEvent.allDay ?? false,
    };
  }

  function computeShift(eventId: SchedulerEventId): ResolvedDates | null {
    // A repositioned seed is being placed by the user: every active predecessor
    // constrains it. Anything else is pushed only by predecessors that moved.
    const constrainedByAll = repositionedSeeds.has(eventId);
    let required: ResolvedDates | null = null;
    for (const dependency of activeDependenciesByTarget.get(eventId) ?? []) {
      const sourceId = dependency.source;
      if (sourceId === eventId || deleted.has(sourceId) || becomesRecurring.has(sourceId)) {
        continue;
      }
      let sourceDates: ResolvedDates | null = null;
      if (movedIds.has(sourceId)) {
        sourceDates = newDates.get(sourceId)!;
      } else if (constrainedByAll) {
        sourceDates = resolveCurrentDates(sourceId);
      }
      if (
        sourceDates !== null &&
        (required === null || sourceDates.endTimestamp > required.endTimestamp)
      ) {
        required = sourceDates;
      }
    }
    if (required === null) {
      return null;
    }

    const base = newDates.get(eventId) ?? resolveCurrentDates(eventId);
    if (base === null) {
      // Not loaded (lazy loading): nothing to move.
      return null;
    }
    if (base.startTimestamp >= required.endTimestamp) {
      return null;
    }
    if (isEventReadOnly(eventId)) {
      blocked.push(eventId);
      return null;
    }

    if (base.allDay) {
      // Minimal whole-day shift; the full-day count floors, so a DST day may need one more.
      let dayCount = Math.max(1, adapter.differenceInDays(required.end, base.start));
      while (adapter.getTime(adapter.addDays(base.start, dayCount)) < required.endTimestamp) {
        dayCount += 1;
      }
      const newStart = adapter.addDays(base.start, dayCount);
      const newStartTimestamp = adapter.getTime(newStart);
      const newEnd =
        startResizedSeeds.has(eventId) && newStartTimestamp < base.endTimestamp
          ? base.end
          : adapter.addDays(base.end, dayCount);
      return {
        start: newStart,
        end: newEnd,
        startTimestamp: newStartTimestamp,
        endTimestamp: adapter.getTime(newEnd),
        allDay: true,
      };
    }

    // After an all-day predecessor, start on the next day's first instant: the inclusive
    // 23:59:59.999 end would not survive the second-resolution serialization.
    const newStart = required.allDay ? adapter.addMilliseconds(required.end, 1) : required.end;
    const newStartTimestamp = adapter.getTime(newStart);
    const newEnd =
      startResizedSeeds.has(eventId) && newStartTimestamp < base.endTimestamp
        ? base.end
        : adapter.addMilliseconds(newStart, base.endTimestamp - base.startTimestamp);
    return {
      start: newStart,
      end: newEnd,
      startTimestamp: newStartTimestamp,
      endTimestamp: adapter.getTime(newEnd),
      allDay: false,
    };
  }
}
