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

const DAY_MS = 24 * 60 * 60 * 1000;

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
   * Used to clamp the batch's own repositioned entries against their predecessors.
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

/**
 * Computes the Finish-to-Start cascade for an `updateEvents` batch: the extra
 * `{ id, start, end }` updates restoring `successor.start >= predecessor.end`, transitively.
 *
 * Push-only: an event only ever moves later — moving a predecessor earlier never pulls
 * successors back, and pre-existing violations on untouched events stay as-is.
 * The batch's own entries are seeds. A seed whose entry sets `start` is being placed by
 * the user, so when it lands before an active predecessor's end it is clamped forward to
 * the first valid position (its clamped dates fold back into its own entry); other seeds
 * are never re-emitted. A read-only successor stays in place and stops the cascade
 * behind it. Timed events keep their duration in absolute milliseconds (same policy as
 * drag-and-drop and paste), all-day events shift by whole days.
 *
 * Topological (Kahn) pass over the subgraph reachable from the seeds — O(V' + E'),
 * each node settled once with the max of its constraining predecessors' ends. Members
 * of a seedless cycle (cyclic props data) never become ready: left unmoved, with a dev
 * warning. A cycle through a seed is broken at the seed, so the nodes behind it are
 * still pushed.
 */
export function computeAutoSchedulingCascade(
  parameters: ComputeAutoSchedulingCascadeParameters,
): SchedulerEventUpdatedProperties[] {
  const {
    adapter,
    processedEventLookup,
    activeDependenciesBySource,
    activeDependenciesByTarget,
    isEventReadOnly,
    deleted,
  } = parameters;

  // Seeds: the events whose dates the batch changes (last entry per id wins, like the store).
  const newDates = new Map<SchedulerEventId, ResolvedDates>();
  // An event turning recurring in this batch leaves the cascade — the active index is
  // derived from the pre-update state, so it cannot have excluded it yet.
  const becomesRecurring = new Set<SchedulerEventId>();
  // Seeds whose entry sets `start`: the user is placing them, so they are clampable.
  const repositionedSeeds = new Set<SchedulerEventId>();

  for (const entry of parameters.updated) {
    if (deleted.has(entry.id)) {
      continue;
    }
    if (entry.rrule != null) {
      becomesRecurring.add(entry.id);
      newDates.delete(entry.id);
      repositionedSeeds.delete(entry.id);
      continue;
    }
    if (entry.start == null && entry.end == null) {
      continue;
    }
    const processedEvent = processedEventLookup.get(entry.id);
    if (processedEvent === undefined) {
      // Not loaded (lazy loading): its dependencies are inactive anyway.
      continue;
    }
    const allDay = entry.allDay ?? processedEvent.allDay ?? false;
    const { start, end } = normalizeAllDayBounds(
      adapter,
      entry.start ?? processedEvent.dataTimezone.start.value,
      entry.end ?? processedEvent.dataTimezone.end.value,
      allDay,
    );
    newDates.set(entry.id, {
      start,
      end,
      startTimestamp: adapter.getTime(start),
      endTimestamp: adapter.getTime(end),
      allDay,
    });
    if (entry.start != null) {
      repositionedSeeds.add(entry.id);
    } else {
      repositionedSeeds.delete(entry.id);
    }
  }

  if (newDates.size === 0) {
    return [];
  }

  const seeds = new Set(newDates.keys());

  // Subgraph reachable from the seeds, visiting each node and edge once.
  const members = new Set<SchedulerEventId>(seeds);
  const incomingSources = new Map<SchedulerEventId, SchedulerEventId[]>();
  const inDegree = new Map<SchedulerEventId, number>();
  const discovery = [...seeds];
  while (discovery.length > 0) {
    const eventId = discovery.pop()!;
    for (const dependency of activeDependenciesBySource.get(eventId) ?? []) {
      const { target } = dependency;
      if (deleted.has(target) || becomesRecurring.has(target)) {
        continue;
      }
      const sources = incomingSources.get(target);
      if (sources) {
        sources.push(eventId);
      } else {
        incomingSources.set(target, [eventId]);
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
  const clampedSeeds = new Set<SchedulerEventId>();
  while (processed.size < members.size) {
    if (ready.length === 0) {
      // Every remaining member waits on a cycle. A seed on the cycle can still settle —
      // its dates are user-given — so the stall breaks there; without one, the
      // remaining members sit behind a seedless cycle and stay unmoved.
      const stalledSeed = [...seeds].find((seedId) => !processed.has(seedId));
      if (stalledSeed === undefined) {
        break;
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
      if (seeds.has(eventId)) {
        clampedSeeds.add(eventId);
      }
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

  const cascaded: SchedulerEventUpdatedProperties[] = [];
  for (const [eventId, dates] of newDates) {
    if (!seeds.has(eventId) || clampedSeeds.has(eventId)) {
      cascaded.push({ id: eventId, start: dates.start, end: dates.end });
    }
  }
  return cascaded;

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
    const isSeed = seeds.has(eventId);
    if (isSeed && !repositionedSeeds.has(eventId)) {
      // The entry left `start` untouched (an end resize): the event is not being
      // repositioned, so a pre-existing violation stays as-is.
      return null;
    }

    let required: ResolvedDates | null = null;
    if (isSeed) {
      // The user is placing this event now, so every active predecessor constrains
      // it — not only the moved ones.
      for (const dependency of activeDependenciesByTarget.get(eventId) ?? []) {
        const sourceId = dependency.source;
        if (sourceId === eventId || deleted.has(sourceId) || becomesRecurring.has(sourceId)) {
          continue;
        }
        const sourceDates = newDates.get(sourceId) ?? resolveCurrentDates(sourceId);
        if (
          sourceDates !== null &&
          (required === null || sourceDates.endTimestamp > required.endTimestamp)
        ) {
          required = sourceDates;
        }
      }
    } else {
      // Only moved predecessors constrain: an unmoved one already satisfied the
      // constraint, or its violation predates the batch.
      for (const sourceId of incomingSources.get(eventId) ?? []) {
        const sourceDates = newDates.get(sourceId);
        if (
          sourceDates &&
          (required === null || sourceDates.endTimestamp > required.endTimestamp)
        ) {
          required = sourceDates;
        }
      }
    }
    if (required === null || isEventReadOnly(eventId)) {
      return null;
    }

    const base = isSeed ? newDates.get(eventId)! : resolveCurrentDates(eventId)!;
    if (base.startTimestamp >= required.endTimestamp) {
      return null;
    }

    if (base.allDay) {
      // Minimal whole-day shift. The ms estimate is corrected through the adapter so a
      // DST transition cannot leave it a day short or long; `addDays` keeps the wall
      // time, preserving the day alignment and span.
      let dayCount = Math.max(1, Math.ceil((required.endTimestamp - base.startTimestamp) / DAY_MS));
      while (adapter.getTime(adapter.addDays(base.start, dayCount)) < required.endTimestamp) {
        dayCount += 1;
      }
      while (
        dayCount > 1 &&
        adapter.getTime(adapter.addDays(base.start, dayCount - 1)) >= required.endTimestamp
      ) {
        dayCount -= 1;
      }
      const newStart = adapter.addDays(base.start, dayCount);
      const newEnd = adapter.addDays(base.end, dayCount);
      return {
        start: newStart,
        end: newEnd,
        startTimestamp: adapter.getTime(newStart),
        endTimestamp: adapter.getTime(newEnd),
        allDay: true,
      };
    }

    const durationMs = base.endTimestamp - base.startTimestamp;
    const newEnd = adapter.addMilliseconds(required.end, durationMs);
    return {
      start: required.end,
      end: newEnd,
      startTimestamp: required.endTimestamp,
      endTimestamp: adapter.getTime(newEnd),
      allDay: false,
    };
  }
}
