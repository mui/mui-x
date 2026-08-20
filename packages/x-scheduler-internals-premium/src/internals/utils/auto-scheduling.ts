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
}

/**
 * Computes the Finish-to-Start cascade for an `updateEvents` batch: the extra
 * `{ id, start, end }` updates restoring `successor.start >= predecessor.end`, transitively.
 *
 * Push-only: a successor moves only when the constraint is actually broken — moving a
 * predecessor earlier never pulls it back, and pre-existing violations stay as-is.
 * The batch's own entries are fixed seeds, never re-emitted. A read-only successor
 * stays in place and stops the cascade behind it. Timed successors keep their duration
 * in absolute milliseconds (same policy as drag-and-drop and paste), all-day successors
 * shift by whole days.
 *
 * Topological (Kahn) pass over the subgraph reachable from the seeds — O(V' + E'),
 * each node settled once with the max of its moved predecessors' new ends. Cycle
 * members (cyclic props data) never become ready: left unmoved, with a dev warning.
 */
export function computeAutoSchedulingCascade(
  parameters: ComputeAutoSchedulingCascadeParameters,
): SchedulerEventUpdatedProperties[] {
  const { adapter, processedEventLookup, activeDependenciesBySource, isEventReadOnly, deleted } =
    parameters;

  // Seeds: the events whose dates the batch changes (last entry per id wins, like the store).
  const newDates = new Map<SchedulerEventId, ResolvedDates>();
  // An event turning recurring in this batch leaves the cascade — the active index is
  // derived from the pre-update state, so it cannot have excluded it yet.
  const becomesRecurring = new Set<SchedulerEventId>();

  for (const entry of parameters.updated) {
    if (deleted.has(entry.id)) {
      continue;
    }
    if (entry.rrule != null) {
      becomesRecurring.add(entry.id);
      newDates.delete(entry.id);
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
    const allDay = entry.allDay ?? processedEvent.allDay;
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
    });
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
      if (!seeds.has(target)) {
        inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
      }
      if (!members.has(target)) {
        members.add(target);
        discovery.push(target);
      }
    }
  }

  // Seeds are ready upfront: their dates are fixed, so a cycle running through a seed
  // does not stall the nodes behind it.
  const ready = [...seeds];
  let processedCount = 0;
  while (ready.length > 0) {
    const eventId = ready.pop()!;
    processedCount += 1;

    if (!seeds.has(eventId)) {
      const shifted = computeShift(eventId);
      if (shifted !== null) {
        newDates.set(eventId, shifted);
      }
    }

    for (const dependency of activeDependenciesBySource.get(eventId) ?? []) {
      const { target } = dependency;
      if (!members.has(target) || seeds.has(target)) {
        continue;
      }
      const remaining = inDegree.get(target)! - 1;
      inDegree.set(target, remaining);
      if (remaining === 0) {
        ready.push(target);
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    if (processedCount < members.size) {
      warnOnce([
        'MUI X Scheduler: The dependencies provided via props contain a cycle.',
        'Auto-scheduling left the events on the cycle (and the ones behind it) unmoved.',
        'Fix the `dependencies` data — `addDependency()` rejects dependencies that would create a cycle.',
      ]);
    }
  }

  const cascaded: SchedulerEventUpdatedProperties[] = [];
  for (const [eventId, dates] of newDates) {
    if (!seeds.has(eventId)) {
      cascaded.push({ id: eventId, start: dates.start, end: dates.end });
    }
  }
  return cascaded;

  function computeShift(eventId: SchedulerEventId): ResolvedDates | null {
    // Only moved predecessors constrain: an unmoved one already satisfied the
    // constraint, or its violation predates the batch.
    let required: ResolvedDates | null = null;
    for (const sourceId of incomingSources.get(eventId) ?? []) {
      const sourceDates = newDates.get(sourceId);
      if (sourceDates && (required === null || sourceDates.endTimestamp > required.endTimestamp)) {
        required = sourceDates;
      }
    }
    if (required === null || isEventReadOnly(eventId)) {
      return null;
    }

    const processedEvent = processedEventLookup.get(eventId)!;
    const { start, end } = normalizeAllDayBounds(
      adapter,
      processedEvent.dataTimezone.start.value,
      processedEvent.dataTimezone.end.value,
      processedEvent.allDay,
    );
    const startTimestamp = adapter.getTime(start);
    if (startTimestamp >= required.endTimestamp) {
      return null;
    }

    if (processedEvent.allDay) {
      // Minimal whole-day shift. The ms estimate is corrected through the adapter so a
      // DST transition cannot leave it a day short or long; `addDays` keeps the wall
      // time, preserving the day alignment and span.
      let dayCount = Math.max(1, Math.ceil((required.endTimestamp - startTimestamp) / DAY_MS));
      while (adapter.getTime(adapter.addDays(start, dayCount)) < required.endTimestamp) {
        dayCount += 1;
      }
      while (
        dayCount > 1 &&
        adapter.getTime(adapter.addDays(start, dayCount - 1)) >= required.endTimestamp
      ) {
        dayCount -= 1;
      }
      const newStart = adapter.addDays(start, dayCount);
      const newEnd = adapter.addDays(end, dayCount);
      return {
        start: newStart,
        end: newEnd,
        startTimestamp: adapter.getTime(newStart),
        endTimestamp: adapter.getTime(newEnd),
      };
    }

    const durationMs =
      processedEvent.dataTimezone.end.timestamp - processedEvent.dataTimezone.start.timestamp;
    const newEnd = adapter.addMilliseconds(required.end, durationMs);
    return {
      start: required.end,
      end: newEnd,
      startTimestamp: required.endTimestamp,
      endTimestamp: adapter.getTime(newEnd),
    };
  }
}
