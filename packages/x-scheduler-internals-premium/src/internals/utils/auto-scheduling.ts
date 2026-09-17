import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEventId,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import { dateToEventString, normalizeAllDayBounds } from '@mui/x-scheduler-internals/internals';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
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
 * predecessors; everything else is pushed only by predecessors whose end advances in the
 * same batch. A `timezone` change moves the effective dates of wall-time events.
 * Timed events keep their duration (a start resize keeps its end instead), all-day events
 * shift by whole days, and a read-only event that would need to move is reported in
 * `blocked` so the caller rejects the batch.
 *
 * Kahn pass over the subgraph reachable from the seeds. Cycles in the props data warn in
 * dev: a seedless cycle stays unmoved, a cycle through a seed is broken at that seed.
 * Only loaded events take part: with lazy loading, an unfetched successor is not pushed.
 * Only Finish-to-Start dependencies take part: the other types have no scheduling rule yet.
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
  // Seeds whose effective start actually moves: the user is placing them, so they are
  // the ones clamped. Checked against the current start: an entry can carry the same
  // dates (a drop released in place, an API call) and those place nothing, while an
  // `allDay` flip moves the start without carrying it.
  const repositionedSeeds = new Set<SchedulerEventId>();
  // Repositioned seeds whose entry left `end` where it is (a start resize): the clamp
  // keeps their end.
  const startResizedSeeds = new Set<SchedulerEventId>();
  // Events whose end moves later in this pass; only these push their successors.
  const advancedIds = new Set<SchedulerEventId>();

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
    const processedEvent = processedEventLookup.get(entry.id);
    if (processedEvent === undefined) {
      // Not loaded (lazy loading): its dependencies are inactive anyway.
      continue;
    }
    const model = processedEvent.modelInBuiltInFormat;
    const dataTimezone = model.timezone ?? 'default';
    const nextTimezone = entry.timezone ?? dataTimezone;
    if (
      entry.start == null &&
      entry.end == null &&
      entry.allDay == null &&
      nextTimezone === dataTimezone
    ) {
      continue;
    }
    const allDay = entry.allDay ?? processedEvent.allDay ?? false;
    // Mirrors the store: entries are serialized in the data timezone
    // (`dateToEventString`) and the model is then read in the (new) timezone.
    const resolveEntryDate = (
      value: TemporalSupportedObject | undefined,
      modelString: string,
      currentValue: TemporalSupportedObject,
    ) => {
      if (nextTimezone === dataTimezone) {
        return value == null ? currentValue : adapter.setTimezone(value, dataTimezone);
      }
      const nextString =
        value == null ? modelString : dateToEventString(adapter, value, modelString, dataTimezone);
      return resolveEventDate(nextString, nextTimezone, adapter, entry.id);
    };
    const { start, end } = normalizeAllDayBounds(
      adapter,
      resolveEntryDate(entry.start, model.start, processedEvent.dataTimezone.start.value),
      resolveEntryDate(entry.end, model.end, processedEvent.dataTimezone.end.value),
      allDay,
    );
    const startTimestamp = adapter.getTime(start);
    const endTimestamp = adapter.getTime(end);
    newDates.set(entry.id, { start, end, startTimestamp, endTimestamp, allDay });

    const current = resolveCurrentDates(entry.id)!;
    const startMoved = startTimestamp !== current.startTimestamp;
    if (startMoved) {
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
      if (!isFinishToStart(dependency) || deleted.has(target) || becomesRecurring.has(target)) {
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
      cascaded.push({ id: eventId, start: shifted.start, end: shifted.end });
    }
    const settled = newDates.get(eventId);
    if (
      settled !== undefined &&
      settled.endTimestamp > resolveCurrentDates(eventId)!.endTimestamp
    ) {
      advancedIds.add(eventId);
    }

    for (const dependency of activeDependenciesBySource.get(eventId) ?? []) {
      const { target } = dependency;
      if (!isFinishToStart(dependency) || !members.has(target)) {
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

  function isFinishToStart(dependency: SchedulerDependency) {
    return dependency.type === 'FinishToStart';
  }

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
    // constrains it. Anything else is pushed only by predecessors whose end advanced.
    const constrainedByAll = repositionedSeeds.has(eventId);
    let required: ResolvedDates | null = null;
    for (const dependency of activeDependenciesByTarget.get(eventId) ?? []) {
      const sourceId = dependency.source;
      if (
        !isFinishToStart(dependency) ||
        sourceId === eventId ||
        deleted.has(sourceId) ||
        becomesRecurring.has(sourceId)
      ) {
        continue;
      }
      let sourceDates: ResolvedDates | null = null;
      if (advancedIds.has(sourceId)) {
        sourceDates = newDates.get(sourceId)!;
      } else if (constrainedByAll) {
        sourceDates = newDates.get(sourceId) ?? resolveCurrentDates(sourceId);
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

    // Wall-time serialization is second-resolution: landing on a fractional end (the
    // inclusive 23:59:59.999 of an all-day predecessor, or milliseconds in the data)
    // would write the successor early, so start on the next whole second.
    const endMilliseconds = adapter.getMilliseconds(required.end);
    const newStart =
      endMilliseconds === 0
        ? required.end
        : adapter.addMilliseconds(required.end, 1000 - endMilliseconds);
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
