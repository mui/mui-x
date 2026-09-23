import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import { dateToEventString, normalizeAllDayBounds } from '@mui/x-scheduler-internals/internals';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerDependency } from '../../models';
import { addDependencyLag, getDependencyEdges, getDependencyLag } from './dependency-utils';

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

interface Bound {
  date: TemporalSupportedObject;
  timestamp: number;
}

export interface AutoSchedulingCascadeResult {
  /**
   * The extra `{ id, start, end }` updates restoring the dependency constraints.
   */
  updated: SchedulerEventUpdatedProperties[];
  /**
   * Read-only events the cascade would have moved: the constraint cannot be restored,
   * so the caller should reject the batch.
   */
  blocked: SchedulerEventId[];
}

/**
 * Computes the dependency cascade for an `updateEvents` batch: the extra
 * `{ id, start, end }` updates restoring the constraints, transitively.
 *
 * Each dependency bounds one edge of the successor by one edge of the predecessor plus
 * the lag (FS: `start >= pred.end`, SS: `start >= pred.start`, FF: `end >= pred.end`,
 * SF: `end >= pred.start`), the lag being added in the successor's timezone.
 *
 * Push-only: events only move later, and pre-existing violations stay as-is. A seed whose
 * entry moves `start` is being placed by the user and is clamped forward by all its
 * predecessors; a seed whose entry only moves `end` is clamped by the predecessors bounding
 * its end; everything else is pushed only by predecessors whose bounding edge advances in
 * the same batch. A `timezone` change moves the effective dates of wall-time events.
 * Timed events keep their duration, except that a resize keeps the edge it did not touch
 * as long as that edge is not the violated one. All-day events shift by whole days, and a
 * read-only event that would need to move is reported in `blocked` so the caller rejects
 * the batch.
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
  // Seeds whose effective start actually moves: the user is placing them, so they are
  // the ones clamped. Checked against the current start: an entry can carry the same
  // dates (a drop released in place, an API call) and those place nothing, while an
  // `allDay` flip moves the start without carrying it.
  const repositionedSeeds = new Set<SchedulerEventId>();
  // Repositioned seeds whose entry left `end` where it is (a start resize): the clamp
  // keeps their end when it can.
  const startResizedSeeds = new Set<SchedulerEventId>();
  // Seeds whose entry only moves `end` (an end resize): clamped by their end bounds,
  // keeping their start when it can.
  const endResizedSeeds = new Set<SchedulerEventId>();
  // Events whose start / end moves later in this pass; only these push the successors
  // bound by that edge.
  const advanced: Record<SchedulerEventSide, Set<SchedulerEventId>> = {
    start: new Set(),
    end: new Set(),
  };
  // Seeds whose entry changes the data timezone: their emitted dates go through the
  // store's serialization in the old timezone.
  const timezoneChanges = new Map<
    SchedulerEventId,
    { model: SchedulerEvent; dataTimezone: TemporalTimezone; nextTimezone: TemporalTimezone }
  >();

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
    // An explicit `undefined` clears the property in the store (back to 'default').
    const nextTimezone = 'timezone' in entry ? (entry.timezone ?? 'default') : dataTimezone;
    if (
      entry.start == null &&
      entry.end == null &&
      entry.allDay == null &&
      nextTimezone === dataTimezone
    ) {
      continue;
    }
    if (nextTimezone !== dataTimezone) {
      timezoneChanges.set(entry.id, { model, dataTimezone, nextTimezone });
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
    } else if (endTimestamp !== current.endTimestamp) {
      endResizedSeeds.add(entry.id);
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
      cascaded.push({ id: eventId, ...toEntryDates(eventId, shifted) });
    }
    const settled = newDates.get(eventId);
    if (settled !== undefined) {
      const current = resolveCurrentDates(eventId)!;
      if (settled.startTimestamp > current.startTimestamp) {
        advanced.start.add(eventId);
      }
      if (settled.endTimestamp > current.endTimestamp) {
        advanced.end.add(eventId);
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

  return { updated: cascaded, blocked };

  // Inverse of `resolveEntryDate` for a seed changing timezone: the store serializes the
  // entry in the old timezone and the model is then read in the new one, so the entry
  // carries the instant whose old-zone wall time is the intended new-zone wall time.
  function toEntryDates(eventId: SchedulerEventId, dates: ResolvedDates) {
    const timezoneChange = timezoneChanges.get(eventId);
    if (timezoneChange === undefined) {
      return { start: dates.start, end: dates.end };
    }
    const { model, dataTimezone, nextTimezone } = timezoneChange;
    const encode = (value: TemporalSupportedObject, modelString: string) =>
      resolveEventDate(
        dateToEventString(adapter, value, modelString, nextTimezone),
        dataTimezone,
        adapter,
        eventId,
      );
    return { start: encode(dates.start, model.start), end: encode(dates.end, model.end) };
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

  // The earliest start and end the predecessors of `eventId` allow, in the timezone of
  // `base`. A repositioned seed is being placed by the user: every active predecessor
  // constrains it. An end-resized seed is constrained by the predecessors bounding its
  // end. Anything else is pushed only by predecessors whose bounding edge advanced.
  function collectBounds(
    eventId: SchedulerEventId,
    base: ResolvedDates,
  ): Record<SchedulerEventSide, Bound | null> {
    const constrainedByAll = repositionedSeeds.has(eventId);
    const constrainedOnEnd = endResizedSeeds.has(eventId);
    const timezone = adapter.getTimezone(base.start);
    const required: Record<SchedulerEventSide, Bound | null> = { start: null, end: null };
    for (const dependency of activeDependenciesByTarget.get(eventId) ?? []) {
      const sourceId = dependency.source;
      if (sourceId === eventId || deleted.has(sourceId) || becomesRecurring.has(sourceId)) {
        continue;
      }
      const edges = getDependencyEdges(dependency.type);
      let sourceDates: ResolvedDates | null = null;
      if (advanced[edges.source].has(sourceId)) {
        sourceDates = newDates.get(sourceId)!;
      } else if (constrainedByAll || (constrainedOnEnd && edges.target === 'end')) {
        sourceDates = newDates.get(sourceId) ?? resolveCurrentDates(sourceId);
      }
      if (sourceDates === null) {
        continue;
      }
      const reference = adapter.setTimezone(sourceDates[edges.source], timezone);
      required[edges.target] = later(
        required[edges.target],
        toBound(addDependencyLag(adapter, reference, getDependencyLag(dependency))),
      );
    }
    return required;
  }

  function computeShift(eventId: SchedulerEventId): ResolvedDates | null {
    const base = newDates.get(eventId) ?? resolveCurrentDates(eventId);
    if (base === null) {
      // Not loaded (lazy loading): nothing to move.
      return null;
    }
    const required = collectBounds(eventId, base);

    const startViolated = required.start !== null && base.startTimestamp < required.start.timestamp;
    const endViolated = required.end !== null && base.endTimestamp < required.end.timestamp;
    if (!startViolated && !endViolated) {
      return null;
    }
    if (isEventReadOnly(eventId)) {
      blocked.push(eventId);
      return null;
    }

    // A resize keeps the edge it did not touch, as long as that edge is not the violated
    // one. Keeping the end also requires the clamp not to run past it.
    // Keeping the start leaves the end as the only violated edge, so its bound is set:
    // holding it here is what lets the branches below read it without an assertion.
    const keptStartBound = endResizedSeeds.has(eventId) && !startViolated ? required.end : null;
    const keepsEnd = (newStartTimestamp: number) =>
      startResizedSeeds.has(eventId) && newStartTimestamp < base.endTimestamp && !endViolated;

    if (base.allDay) {
      if (keptStartBound !== null) {
        const newEnd = adapter.addDays(base.end, minimalDayShift(base.end, keptStartBound));
        return { ...base, end: newEnd, endTimestamp: adapter.getTime(newEnd) };
      }
      const dayCount = Math.max(
        required.start === null ? 0 : minimalDayShift(base.start, required.start),
        required.end === null ? 0 : minimalDayShift(base.end, required.end),
      );
      const newStart = adapter.addDays(base.start, dayCount);
      const newStartTimestamp = adapter.getTime(newStart);
      const newEnd = keepsEnd(newStartTimestamp) ? base.end : adapter.addDays(base.end, dayCount);
      return {
        start: newStart,
        end: newEnd,
        startTimestamp: newStartTimestamp,
        endTimestamp: adapter.getTime(newEnd),
        allDay: true,
      };
    }

    if (keptStartBound !== null) {
      const newEnd = roundUpToSecond(keptStartBound.date);
      return { ...base, end: newEnd, endTimestamp: adapter.getTime(newEnd) };
    }
    const duration = base.endTimestamp - base.startTimestamp;
    let candidate = required.start;
    if (required.end !== null) {
      candidate = later(candidate, toBound(adapter.addMilliseconds(required.end.date, -duration)));
    }
    // A violated edge always leaves a candidate.
    const newStart = roundUpToSecond(candidate!.date);
    const newStartTimestamp = adapter.getTime(newStart);
    const newEnd = keepsEnd(newStartTimestamp)
      ? base.end
      : adapter.addMilliseconds(newStart, duration);
    return {
      start: newStart,
      end: newEnd,
      startTimestamp: newStartTimestamp,
      endTimestamp: adapter.getTime(newEnd),
      allDay: false,
    };
  }

  function toBound(date: TemporalSupportedObject): Bound {
    return { date, timestamp: adapter.getTime(date) };
  }

  function later(current: Bound | null, bound: Bound): Bound {
    return current === null || bound.timestamp > current.timestamp ? bound : current;
  }

  // Wall-time serialization is second-resolution: a fractional bound (inherited from the
  // inclusive 23:59:59.999 of an all-day predecessor, or from milliseconds in the data)
  // would write the successor early, so land on the next whole second.
  function roundUpToSecond(date: TemporalSupportedObject): TemporalSupportedObject {
    const milliseconds = adapter.getMilliseconds(date);
    return milliseconds === 0 ? date : adapter.addMilliseconds(date, 1000 - milliseconds);
  }

  // Minimal whole-day shift bringing `edge` to `bound`; the full-day count floors, so a
  // DST day may need one more.
  function minimalDayShift(edge: TemporalSupportedObject, bound: Bound): number {
    let dayCount = Math.max(0, adapter.differenceInDays(bound.date, edge));
    while (adapter.getTime(adapter.addDays(edge, dayCount)) < bound.timestamp) {
      dayCount += 1;
    }
    return dayCount;
  }
}
