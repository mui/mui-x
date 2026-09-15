import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';

type EventRangeEntry = [event: SchedulerProcessedEvent, index: number, start: number, end: number];

export interface SchedulerEventRangeIndex {
  getEventsForRange(
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ): SchedulerProcessedEvent[];
}

function buildMaxEndIndex(entries: EventRangeEntry[]) {
  let leafCount = 1;
  while (leafCount < entries.length) {
    leafCount *= 2;
  }

  const maxEndByNode = new Float64Array(leafCount * 2);
  maxEndByNode.fill(-Infinity);

  for (let index = 0; index < entries.length; index += 1) {
    maxEndByNode[leafCount + index] = entries[index][3];
  }
  for (let nodeIndex = leafCount - 1; nodeIndex > 0; nodeIndex -= 1) {
    maxEndByNode[nodeIndex] = Math.max(
      maxEndByNode[nodeIndex * 2],
      maxEndByNode[nodeIndex * 2 + 1],
    );
  }

  return { leafCount, maxEndByNode };
}

function findFirstEntryStartingAfter(entries: EventRangeEntry[], end: number) {
  let low = 0;
  let high = entries.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (entries[middle][2] <= end) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low;
}

function queryMaxEndIndex(
  entries: EventRangeEntry[],
  maxEndByNode: Float64Array,
  nodeIndex: number,
  entryStartIndex: number,
  entryEndIndex: number,
  firstEntryStartingAfterRange: number,
  start: number,
  result: EventRangeEntry[],
) {
  if (entryStartIndex >= firstEntryStartingAfterRange || maxEndByNode[nodeIndex] < start) {
    return;
  }

  if (entryEndIndex - entryStartIndex === 1) {
    result.push(entries[entryStartIndex]);
    return;
  }

  const middle = Math.floor((entryStartIndex + entryEndIndex) / 2);
  queryMaxEndIndex(
    entries,
    maxEndByNode,
    nodeIndex * 2,
    entryStartIndex,
    middle,
    firstEntryStartingAfterRange,
    start,
    result,
  );
  queryMaxEndIndex(
    entries,
    maxEndByNode,
    nodeIndex * 2 + 1,
    middle,
    entryEndIndex,
    firstEntryStartingAfterRange,
    start,
    result,
  );
}

/**
 * Creates an index that returns events whose range intersects the requested range, including both
 * boundaries. Results preserve the input order. When recurring events are expanded, the index
 * always returns them as candidates regardless of their original range.
 */
export function createEventRangeIndex(
  events: SchedulerProcessedEvent[],
  adapter: Adapter,
  expandRecurringEvents: boolean,
): SchedulerEventRangeIndex {
  const recurringEntries: EventRangeEntry[] = [];
  const rangeEntries: EventRangeEntry[] = [];
  let earliestRangeEnd = Infinity;

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
      earliestRangeEnd = Math.min(earliestRangeEnd, entry[3]);
    }
  });

  rangeEntries.sort((a, b) => a[2] - b[2] || a[1] - b[1]);
  const { leafCount, maxEndByNode } = buildMaxEndIndex(rangeEntries);
  const latestRangeStart = rangeEntries[rangeEntries.length - 1]?.[2] ?? -Infinity;

  return {
    getEventsForRange(start, end) {
      const startTimestamp = adapter.getTime(start);
      const endTimestamp = adapter.getTime(end);

      if (startTimestamp <= earliestRangeEnd && endTimestamp >= latestRangeStart) {
        return events.slice();
      }

      const matches: EventRangeEntry[] = [];
      queryMaxEndIndex(
        rangeEntries,
        maxEndByNode,
        1,
        0,
        leafCount,
        findFirstEntryStartingAfter(rangeEntries, endTimestamp),
        startTimestamp,
        matches,
      );
      matches.push(...recurringEntries);

      if (matches.length > events.length / 4) {
        return events.filter(
          (event) =>
            (expandRecurringEvents && Boolean(event.displayTimezone.rrule)) ||
            (event.displayTimezone.start.timestamp <= endTimestamp &&
              event.displayTimezone.end.timestamp >= startTimestamp),
        );
      }

      matches.sort((a, b) => a[1] - b[1]);
      return matches.map((entry) => entry[0]);
    },
  };
}
