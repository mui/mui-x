import { warnOnce } from '@mui/x-internals/warning';
import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEvent,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import {
  createAdapterDate,
  dateToEventString,
  getEndOfDayMs,
  getStartOfDayMs,
  localToEpochMs,
  MS_PER_DAY,
  toLocalDayNumber,
} from '@mui/x-scheduler-internals/internals';
import { resolveEventDate } from '@mui/x-scheduler-internals/process-event';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerDependency } from '../../models';
import {
  addDependencyLag,
  getDependencyEdges,
  getEffectiveDependencyLag,
  isDependencyActive,
} from './dependency-utils';

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
  /**
   * Dependencies just created or made stricter: their target is pushed even though no
   * predecessor moved.
   */
  enforcedDependencies?: readonly SchedulerDependency[];
}

/**
 * The dates of an event as the engine works on them: instants, with the timezone its days and
 * its wall-clock times are read in.
 */
interface ResolvedDates {
  start: number;
  end: number;
  timezone: TemporalTimezone;
  allDay: boolean;
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
 * The dates of an event from its instants. An all-day event spans whole days, like
 * `normalizeAllDayBounds()`.
 */
function resolveDates(
  start: number,
  end: number,
  timezone: TemporalTimezone,
  allDay: boolean,
): ResolvedDates {
  if (!allDay) {
    return { start, end, timezone, allDay };
  }
  return {
    start: getStartOfDayMs(start, timezone),
    end: getEndOfDayMs(end, timezone),
    timezone,
    allDay,
  };
}

function resolveProcessedEventDates(processedEvent: SchedulerProcessedEvent): ResolvedDates {
  const { start, end, timezone } = processedEvent.dataTimezone;
  return resolveDates(start.timestamp, end.timestamp, timezone, processedEvent.allDay ?? false);
}

// The range of `Date`.
const MAX_TIMESTAMP = 8.64e15;

/**
 * The earliest instant `dependency` allows for the successor's bounded edge, or `null` when
 * the lag runs past the supported date range. The lag is added in the successor's timezone.
 */
function getDependencyBound(
  dependency: SchedulerDependency,
  sourceDates: ResolvedDates,
  targetDates: ResolvedDates,
): number | null {
  const edges = getDependencyEdges(dependency.type);
  const timestamp = addDependencyLag(
    sourceDates[edges.source],
    getEffectiveDependencyLag(dependency, targetDates.allDay),
    targetDates.timezone,
  );
  // `NaN` fails the comparison too.
  return Math.abs(timestamp) <= MAX_TIMESTAMP ? timestamp : null;
}

// The cascade shifts the all-day events with day numbers rather than plain dates: it can move
// hundreds of events, and creating plain dates would make it noticeably slower.

/**
 * The `side` of an all-day event on the day `dayNumber`: the first instant of the day for its
 * start, or the last instant before the next day for its end. A day whose midnight a DST
 * transition skips starts at the end of the gap.
 */
function getAllDayEdgeMs(dayNumber: number, side: SchedulerEventSide, timezone: TemporalTimezone) {
  return side === 'start'
    ? localToEpochMs(dayNumber * MS_PER_DAY, timezone)
    : localToEpochMs((dayNumber + 1) * MS_PER_DAY, timezone) - 1;
}

// Whether `timezone` skips the day, like December 30th, 2011 in Pacific/Apia. An all-day edge
// shifted onto it would end before it starts.
function isSkippedDay(dayNumber: number, timezone: TemporalTimezone): boolean {
  // Its first instant belongs to the next day.
  return toLocalDayNumber(getAllDayEdgeMs(dayNumber, 'start', timezone), timezone) > dayNumber;
}

// Minimal whole-day shift bringing the `side` of an all-day event, on the day `edgeDay`, to `bound`.
function minimalDayShift(
  edgeDay: number,
  side: SchedulerEventSide,
  bound: number,
  timezone: TemporalTimezone,
): number {
  let dayCount = Math.max(0, toLocalDayNumber(bound, timezone) - edgeDay - 1);
  while (getAllDayEdgeMs(edgeDay + dayCount, side, timezone) < bound) {
    dayCount += 1;
  }
  return dayCount;
}

/**
 * How far the target of `dependency` has to move for the dependency to hold with the
 * current event dates: in milliseconds, or in whole days for an all-day target (the
 * cascade shifts those by days). `0` when it already holds or the engine ignores it.
 */
export function getDependencyViolation(
  processedEventLookup: Map<SchedulerEventId, SchedulerProcessedEvent>,
  dependency: SchedulerDependency,
): number {
  // The engine never constrains an event by itself.
  if (
    dependency.source === dependency.target ||
    !isDependencyActive(processedEventLookup, dependency)
  ) {
    return 0;
  }
  const targetDates = resolveProcessedEventDates(processedEventLookup.get(dependency.target)!);
  const bound = getDependencyBound(
    dependency,
    resolveProcessedEventDates(processedEventLookup.get(dependency.source)!),
    targetDates,
  );
  if (bound === null) {
    return 0;
  }
  const targetSide = getDependencyEdges(dependency.type).target;
  if (targetDates.allDay) {
    const { timezone } = targetDates;
    const edgeDay = toLocalDayNumber(targetDates[targetSide], timezone);
    return minimalDayShift(edgeDay, targetSide, bound, timezone);
  }
  return Math.max(0, bound - targetDates[targetSide]);
}

/**
 * Computes the dependency cascade for an `updateEvents` batch or a created/edited
 * dependency: the extra `{ id, start, end }` updates restoring the constraints,
 * transitively.
 *
 * Each dependency bounds one edge of the successor by one edge of the predecessor plus
 * the lag (FS: `start >= pred.end`, SS: `start >= pred.start`, FF: `end >= pred.end`,
 * SF: `end >= pred.start`), the lag being added in the successor's timezone.
 *
 * Push-only: events only move later, and pre-existing violations stay as-is unless their
 * dependency is enforced. A seed whose entry moves `start` is being placed by the user and
 * is clamped forward by all its predecessors; a seed whose entry only moves `end` is
 * clamped by the predecessors bounding its end; everything else is pushed only by
 * predecessors whose lagged bound advances in the same batch, or by an enforced
 * dependency. A `timezone` change moves the effective dates of wall-time events.
 * Timed events keep their duration, except that a resize keeps the edge it did not touch
 * as long as that edge is not the violated one. All-day events shift by whole days, and a
 * read-only event that would need to move is reported in `blocked` so the caller rejects
 * the batch.
 *
 * Kahn pass over the subgraph reachable from the seeds and the enforced targets. Cycles in
 * the props data warn in dev: a cycle through either is broken there, any other stays unmoved.
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
    enforcedDependencies = [],
  } = parameters;

  const newDates = new Map<SchedulerEventId, ResolvedDates>();
  // The dates of the events before the batch, read once per event.
  const currentDatesById = new Map<SchedulerEventId, ResolvedDates | null>();
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
    const resolveEntryTimestamp = (
      value: TemporalSupportedObject | undefined,
      modelString: string,
      currentTimestamp: number,
    ) => {
      if (nextTimezone === dataTimezone) {
        return value == null ? currentTimestamp : adapter.getTime(value);
      }
      const nextString =
        value == null ? modelString : dateToEventString(adapter, value, modelString, dataTimezone);
      return adapter.getTime(resolveEventDate(nextString, nextTimezone, adapter, entry.id));
    };
    const dates = resolveDates(
      resolveEntryTimestamp(entry.start, model.start, processedEvent.dataTimezone.start.timestamp),
      resolveEntryTimestamp(entry.end, model.end, processedEvent.dataTimezone.end.timestamp),
      nextTimezone,
      allDay,
    );
    const { start: startTimestamp, end: endTimestamp } = dates;
    newDates.set(entry.id, dates);

    const current = resolveCurrentDates(entry.id)!;
    const startMoved = startTimestamp !== current.start;
    if (startMoved) {
      repositionedSeeds.add(entry.id);
      if (endTimestamp === current.end) {
        startResizedSeeds.add(entry.id);
      }
    } else if (endTimestamp !== current.end) {
      endResizedSeeds.add(entry.id);
    }
  }

  const blocked: SchedulerEventId[] = [];

  const enforcedIds = new Set<SchedulerDependency['id']>();
  // The seeds plus the targets of the enforced dependencies: where the cascade starts.
  const roots = new Set(newDates.keys());
  for (const dependency of enforcedDependencies) {
    if (!deleted.has(dependency.target) && !becomesRecurring.has(dependency.target)) {
      enforcedIds.add(dependency.id);
      roots.add(dependency.target);
    }
  }

  if (roots.size === 0) {
    return { updated: [], blocked };
  }

  // Subgraph reachable from the roots, visiting each node and edge once.
  const members = new Set<SchedulerEventId>(roots);
  const inDegree = new Map<SchedulerEventId, number>();
  const discovery = [...roots];
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
  for (const rootId of roots) {
    if ((inDegree.get(rootId) ?? 0) === 0) {
      ready.push(rootId);
    }
  }
  const processed = new Set<SchedulerEventId>();
  const cascaded: SchedulerEventUpdatedProperties[] = [];
  while (processed.size < members.size) {
    if (ready.length === 0) {
      // Every remaining member waits on a cycle. A root on it can still settle (its
      // dates are the user's, or its constraint is enforced), so the stall breaks there;
      // a rootless cycle stays unmoved.
      const stalledRoot = [...roots].find((rootId) => !processed.has(rootId));
      if (stalledRoot === undefined) {
        break;
      }
      if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          [
            'MUI X Scheduler: The dependencies provided via props contain a cycle through a rescheduled event.',
            'Auto-scheduling processed that event with the cycle unresolved, so its members may keep violating each other.',
            'Fix the `dependencies` data — `addDependency()` rejects dependencies that would create a cycle.',
          ].join('\n'),
        );
      }
      ready.push(stalledRoot);
    }
    const eventId = ready.pop()!;
    if (processed.has(eventId)) {
      // A force-broken root can still reach in-degree 0 afterwards.
      continue;
    }
    processed.add(eventId);

    const shifted = computeShift(eventId);
    if (shifted !== null) {
      // Report only the edge(s) that actually differ from `base` (captured before `newDates`
      // below moves it): `keepsEnd` / `keptStartBound` can leave one edge untouched, and
      // reporting it anyway would turn a resize into a move `updateEvents` refuses wholesale.
      const base = newDates.get(eventId) ?? resolveCurrentDates(eventId)!;
      const startChanged = shifted.start !== base.start;
      const endChanged = shifted.end !== base.end;
      newDates.set(eventId, shifted);
      if (startChanged || endChanged) {
        const dates = toEntryDates(eventId, shifted);
        cascaded.push({
          id: eventId,
          ...(startChanged ? { start: dates.start } : {}),
          ...(endChanged ? { end: dates.end } : {}),
        });
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
      warnOnce(
        [
          'MUI X Scheduler: The dependencies provided via props contain a cycle.',
          'Auto-scheduling left the events on the cycle (and the ones behind it) unmoved.',
          'Fix the `dependencies` data — `addDependency()` rejects dependencies that would create a cycle.',
        ].join('\n'),
      );
    }
  }

  return { updated: cascaded, blocked };

  // Inverse of `resolveEntryDate` for a seed changing timezone: the store serializes the
  // entry in the old timezone and the model is then read in the new one, so the entry
  // carries the instant whose old-zone wall time is the intended new-zone wall time.
  function toEntryDates(eventId: SchedulerEventId, dates: ResolvedDates) {
    const start = createAdapterDate(adapter, dates.start, dates.timezone);
    const end = createAdapterDate(adapter, dates.end, dates.timezone);
    const timezoneChange = timezoneChanges.get(eventId);
    if (timezoneChange === undefined) {
      return { start, end };
    }
    const { model, dataTimezone, nextTimezone } = timezoneChange;
    const encode = (value: TemporalSupportedObject, modelString: string) =>
      resolveEventDate(
        dateToEventString(adapter, value, modelString, nextTimezone),
        dataTimezone,
        adapter,
        eventId,
      );
    return { start: encode(start, model.start), end: encode(end, model.end) };
  }

  function resolveCurrentDates(eventId: SchedulerEventId): ResolvedDates | null {
    let dates = currentDatesById.get(eventId);
    if (dates === undefined) {
      const processedEvent = processedEventLookup.get(eventId);
      dates = processedEvent === undefined ? null : resolveProcessedEventDates(processedEvent);
      currentDatesById.set(eventId, dates);
    }
    return dates;
  }

  // The earliest start and end the predecessors of `eventId` allow, in the timezone of
  // `base`. A repositioned seed is being placed by the user: every active predecessor
  // constrains it. An end-resized seed is constrained by the predecessors bounding its
  // end. Anything else is pushed only by the predecessors whose lagged bound advanced,
  // comparing the bound before the batch (current dates and settings) with the bound after
  // it. An enforced dependency constrains it whether or not its predecessor moved. A lag
  // in days is added on the wall clock, so the bound can advance while the predecessor
  // moves earlier (DST fall-back), or when only the successor's timezone or `allDay`
  // changes.
  function collectBounds(
    eventId: SchedulerEventId,
    base: ResolvedDates,
  ): Record<SchedulerEventSide, number | null> {
    const constrainedByAll = repositionedSeeds.has(eventId);
    const constrainedOnEnd = endResizedSeeds.has(eventId);
    const current = resolveCurrentDates(eventId);
    const required: Record<SchedulerEventSide, number | null> = { start: null, end: null };
    for (const dependency of activeDependenciesByTarget.get(eventId) ?? []) {
      const sourceId = dependency.source;
      if (sourceId === eventId || deleted.has(sourceId) || becomesRecurring.has(sourceId)) {
        continue;
      }
      const edges = getDependencyEdges(dependency.type);
      const currentDates = resolveCurrentDates(sourceId);
      let bound: number | null = null;
      if (
        constrainedByAll ||
        (constrainedOnEnd && edges.target === 'end') ||
        enforcedIds.has(dependency.id)
      ) {
        const sourceDates = newDates.get(sourceId) ?? currentDates;
        bound = sourceDates === null ? null : getDependencyBound(dependency, sourceDates, base);
      } else {
        const sourceDates =
          (processed.has(sourceId) ? newDates.get(sourceId) : undefined) ?? currentDates;
        // Neither event moved, so the bound didn't advance.
        if (sourceDates === currentDates && base === current) {
          continue;
        }
        if (sourceDates !== null) {
          const nextBound = getDependencyBound(dependency, sourceDates, base);
          const previousBound =
            currentDates === null || current === null
              ? null
              : getDependencyBound(dependency, currentDates, current);
          if (nextBound !== null && (previousBound === null || nextBound > previousBound)) {
            bound = nextBound;
          }
        }
      }
      if (bound !== null) {
        required[edges.target] = later(required[edges.target], bound);
      }
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

    const startViolated = required.start !== null && base.start < required.start;
    const endViolated = required.end !== null && base.end < required.end;
    if (!startViolated && !endViolated) {
      return null;
    }
    if (isEventReadOnly(eventId)) {
      blocked.push(eventId);
      return null;
    }

    // A resize keeps the edge it did not touch, as long as that edge is not the violated
    // one. Keeping the end also requires the clamp not to run past it. Keeping the start
    // leaves the end as the only violated edge, so its bound is always set here.
    const keptStartBound = endResizedSeeds.has(eventId) && !startViolated ? required.end : null;
    const keepsEnd = (newStartTimestamp: number) =>
      startResizedSeeds.has(eventId) && newStartTimestamp < base.end && !endViolated;

    if (base.allDay) {
      const { timezone } = base;
      const startDay = toLocalDayNumber(base.start, timezone);
      const endDay = toLocalDayNumber(base.end, timezone);
      if (keptStartBound !== null) {
        const dayCount = minimalDayShift(endDay, 'end', keptStartBound, timezone);
        return { ...base, end: getAllDayEdgeMs(endDay + dayCount, 'end', timezone) };
      }
      let dayCount = Math.max(
        required.start === null ? 0 : minimalDayShift(startDay, 'start', required.start, timezone),
        required.end === null ? 0 : minimalDayShift(endDay, 'end', required.end, timezone),
      );
      // A kept end does not move, so only the shifted end can land on a skipped day.
      while (
        isSkippedDay(startDay + dayCount, timezone) ||
        (!keepsEnd(getAllDayEdgeMs(startDay + dayCount, 'start', timezone)) &&
          isSkippedDay(endDay + dayCount, timezone))
      ) {
        dayCount += 1;
      }
      const newStartTimestamp = getAllDayEdgeMs(startDay + dayCount, 'start', timezone);
      return {
        ...base,
        start: newStartTimestamp,
        end: keepsEnd(newStartTimestamp)
          ? base.end
          : getAllDayEdgeMs(endDay + dayCount, 'end', timezone),
      };
    }

    if (keptStartBound !== null) {
      return { ...base, end: roundUpToSecond(keptStartBound) };
    }
    const duration = base.end - base.start;
    let candidate = required.start;
    if (required.end !== null) {
      // Rounded first: the end is written at second resolution too.
      candidate = later(candidate, roundUpToSecond(required.end) - duration);
    }
    // A violated edge always leaves a candidate.
    const newStartTimestamp = roundUpToSecond(candidate!);
    return {
      ...base,
      start: newStartTimestamp,
      end: keepsEnd(newStartTimestamp) ? base.end : newStartTimestamp + duration,
    };
  }

  function later(current: number | null, bound: number): number {
    return current === null || bound > current ? bound : current;
  }

  // Wall-time serialization is second-resolution: a fractional bound (inherited from the
  // inclusive 23:59:59.999 of an all-day predecessor, or from milliseconds in the data)
  // would write the successor early, so land on the next whole second.
  function roundUpToSecond(timestamp: number): number {
    // Offsets are whole seconds, so the milliseconds are the same on every wall clock.
    return Math.ceil(timestamp / 1000) * 1000;
  }
}
