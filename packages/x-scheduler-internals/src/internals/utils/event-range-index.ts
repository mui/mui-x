import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';

type EventRangeEntry = [event: SchedulerProcessedEvent, index: number, start: number, end: number];
type EventRangeNode = [
  entry: EventRangeEntry,
  left: EventRangeNode | null,
  right: EventRangeNode | null,
  maxEnd: number,
];

export interface SchedulerEventRangeIndex {
  getEventsForRange(
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ): SchedulerProcessedEvent[];
}

function buildTree(entries: EventRangeEntry[], start: number, end: number): EventRangeNode | null {
  if (start >= end) {
    return null;
  }

  const middle = Math.floor((start + end) / 2);
  const entry = entries[middle];
  const left = buildTree(entries, start, middle);
  const right = buildTree(entries, middle + 1, end);

  return [entry, left, right, Math.max(entry[3], left?.[3] ?? -Infinity, right?.[3] ?? -Infinity)];
}

function queryTree(
  node: EventRangeNode | null,
  start: number,
  end: number,
  result: EventRangeEntry[],
) {
  if (node == null || node[3] < start) {
    return;
  }

  queryTree(node[1], start, end, result);

  const entry = node[0];
  if (entry[2] <= end && entry[3] >= start) {
    result.push(entry);
  }

  if (entry[2] <= end) {
    queryTree(node[2], start, end, result);
  }
}

export function createEventRangeIndex(
  events: SchedulerProcessedEvent[],
  adapter: Adapter,
  expandRecurringEvents: boolean,
): SchedulerEventRangeIndex {
  const recurringEntries: EventRangeEntry[] = [];
  const rangeEntries: EventRangeEntry[] = [];

  events.forEach((event, index) => {
    const entry: EventRangeEntry = [
      event,
      index,
      event.displayTimezone.start.timestamp,
      event.displayTimezone.end.timestamp,
    ];

    if (expandRecurringEvents && event.displayTimezone.rrule) {
      recurringEntries.push(entry);
    } else {
      rangeEntries.push(entry);
    }
  });

  rangeEntries.sort((a, b) => a[2] - b[2] || a[1] - b[1]);
  const root = buildTree(rangeEntries, 0, rangeEntries.length);

  return {
    getEventsForRange(start, end) {
      const matches: EventRangeEntry[] = [];
      queryTree(root, adapter.getTime(start), adapter.getTime(end), matches);
      matches.push(...recurringEntries);
      matches.sort((a, b) => a[1] - b[1]);
      return matches.map((entry) => entry[0]);
    },
  };
}
