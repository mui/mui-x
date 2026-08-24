import * as React from 'react';
import { sortEventOccurrences } from '../sort-event-occurrences';
import type { SchedulerEventOccurrence, SchedulerEventOccurrencePlaceholder } from '../models';

/**
 * Places event occurrences for a timeline UI.
 */
export function useEventOccurrencesWithTimelinePosition(
  parameters: useEventOccurrencesWithTimelinePosition.Parameters,
): useEventOccurrencesWithTimelinePosition.ReturnValue {
  const { occurrences, maxSpan } = parameters;

  return React.useMemo(
    () => computeOccurrencesWithTimelinePosition(occurrences, maxSpan),
    [occurrences, maxSpan],
  );
}

export function computeOccurrencesWithTimelinePosition(
  occurrences: readonly SchedulerEventOccurrence[],
  maxSpan: number,
): useEventOccurrencesWithTimelinePosition.ReturnValue {
  const sortedOccurrences = sortEventOccurrences(occurrences);
  const { firstIndexLookup, lastIndexLookup, maxIndex } = buildOccurrenceIndexLookups(
    sortedOccurrences,
    maxSpan,
  );

  const occurrencesWithPosition = sortedOccurrences.map((occurrence) => ({
    ...occurrence,
    position: {
      firstIndex: firstIndexLookup[occurrence.key],
      lastIndex: lastIndexLookup[occurrence.key],
    },
  }));

  return { occurrences: occurrencesWithPosition, maxIndex };
}

/**
 * Pure helper that returns the lane count (`maxIndex`) for a set of
 * occurrences. Equivalent to `useEventOccurrencesWithTimelinePosition().maxIndex`
 * but callable outside React (e.g. inside a `useMemo`).
 */
export function computeOccurrencesMaxIndex(
  occurrences: readonly SchedulerEventOccurrence[],
): number {
  const sortedOccurrences = sortEventOccurrences(occurrences);
  return buildOccurrenceIndexLookups(sortedOccurrences, 1).maxIndex;
}

/**
 * Pure helper that returns the 1-based lane (`firstIndex`) of each occurrence, keyed by
 * occurrence key. Matches the `position.firstIndex` the hook returns, so it can be used
 * to locate occurrences in rows that are not mounted.
 */
export function computeOccurrencesFirstIndexLookup(
  occurrences: readonly SchedulerEventOccurrence[],
): { [occurrenceKey: string]: number } {
  const sortedOccurrences = sortEventOccurrences(occurrences);
  return buildOccurrenceIndexLookups(sortedOccurrences, 1).firstIndexLookup;
}

export namespace useEventOccurrencesWithTimelinePosition {
  export interface Parameters {
    /**
     * The occurrences without the position information
     */
    occurrences: readonly SchedulerEventOccurrence[];
    /**
     * Maximum amount of columns an event can span across.
     */
    maxSpan: number;
  }

  export interface EventOccurrencePosition {
    /**
     * The first (1-based) index of the row / column the event should be rendered in.
     */
    firstIndex: number;
    /**
     * The last (1-based) index of the row / column the event should be rendered in.
     */
    lastIndex: number;
  }

  export interface EventOccurrenceWithPosition extends SchedulerEventOccurrence {
    position: EventOccurrencePosition;
  }

  export interface EventOccurrencePlaceholderWithPosition extends SchedulerEventOccurrencePlaceholder {
    position: EventOccurrencePosition;
  }

  export type EventRenderableOccurrenceWithPosition =
    EventOccurrenceWithPosition | EventOccurrencePlaceholderWithPosition;

  export interface ReturnValue {
    /**
     * The occurrences augmented with position information
     */
    occurrences: EventOccurrenceWithPosition[];
    /**
     * The biggest index an event with position has on this time frame.
     */
    maxIndex: number;
  }
}

class BinaryIndexedTree {
  private readonly values: number[];

  constructor(size: number) {
    this.values = new Array(size + 1).fill(0);
  }

  add(index: number, value: number) {
    // eslint-disable-next-line no-bitwise
    for (let i = index; i < this.values.length; i += i & -i) {
      this.values[i] += value;
    }
  }

  sum(index: number) {
    let result = 0;
    // eslint-disable-next-line no-bitwise
    for (let i = index; i > 0; i -= i & -i) {
      result += this.values[i];
    }
    return result;
  }

  findByOrder(order: number) {
    let index = 0;
    let bit = 2 ** Math.floor(Math.log2(this.values.length - 1));
    let remaining = order;

    while (bit > 0) {
      const nextIndex = index + bit;
      if (nextIndex < this.values.length && this.values[nextIndex] < remaining) {
        index = nextIndex;
        remaining -= this.values[nextIndex];
      }
      // eslint-disable-next-line no-bitwise
      bit >>= 1;
    }

    return index + 1;
  }
}

function buildOccurrenceIndexLookups(occurrences: SchedulerEventOccurrence[], maxSpan: number) {
  const activeOccurrences: ActiveOccurrence[] = [];
  const availableIndexes: number[] = [];
  const activeOccurrenceByIndex: Array<number | undefined> = [];
  const activeIndexes = maxSpan >= 2 ? new BinaryIndexedTree(occurrences.length) : null;
  const firstIndexLookup: OccurrenceIndexLookup = {};
  const nextConflictingIndexLookup: OccurrenceIndexLookup = {};
  let nextIndex = 1;

  for (let occurrenceIndex = 0; occurrenceIndex < occurrences.length; occurrenceIndex += 1) {
    const occurrence = occurrences[occurrenceIndex];
    const startTimestamp = occurrence.displayTimezone.start.timestamp;

    while (activeOccurrences[0]?.endTimestamp <= startTimestamp) {
      const endedOccurrence = popHeap(activeOccurrences)!;
      pushHeap(availableIndexes, endedOccurrence.index);
      if (activeIndexes) {
        activeOccurrenceByIndex[endedOccurrence.index] = undefined;
        activeIndexes.add(endedOccurrence.index, -1);
      }
    }

    const index = popHeap(availableIndexes) ?? nextIndex;
    if (index === nextIndex) {
      nextIndex += 1;
    }

    firstIndexLookup[occurrence.key] = index;

    if (activeIndexes) {
      if (index > 1) {
        // All lower indexes are active because this is the first available index.
        const previousOccurrenceIndex = activeOccurrenceByIndex[index - 1]!;
        const previousOccurrenceKey = occurrences[previousOccurrenceIndex].key;
        nextConflictingIndexLookup[previousOccurrenceKey] = Math.min(
          nextConflictingIndexLookup[previousOccurrenceKey] ?? Infinity,
          index,
        );
      }

      const activeIndexCount = activeIndexes.sum(index);
      if (activeIndexCount < activeOccurrences.length) {
        nextConflictingIndexLookup[occurrence.key] = activeIndexes.findByOrder(
          activeIndexCount + 1,
        );
      }

      activeIndexes.add(index, 1);
      activeOccurrenceByIndex[index] = occurrenceIndex;
    }

    pushHeap(activeOccurrences, {
      endTimestamp: occurrence.displayTimezone.end.timestamp,
      index,
    });
  }

  const maxIndex = Math.max(1, nextIndex - 1);
  if (maxSpan < 2) {
    return { firstIndexLookup, lastIndexLookup: firstIndexLookup, maxIndex };
  }

  const lastIndexLookup: OccurrenceIndexLookup = {};
  for (const occurrence of occurrences) {
    const firstIndex = firstIndexLookup[occurrence.key];
    const nextConflictingIndex = nextConflictingIndexLookup[occurrence.key] ?? maxIndex + 1;
    lastIndexLookup[occurrence.key] = Math.min(
      nextConflictingIndex - 1,
      maxIndex,
      firstIndex + maxSpan - 1,
    );
  }

  return { firstIndexLookup, lastIndexLookup, maxIndex };
}

function pushHeap<T extends number | ActiveOccurrence>(heap: T[], value: T) {
  heap.push(value);
  let index = heap.length - 1;
  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (getHeapValue(heap[parentIndex]) <= getHeapValue(value)) {
      break;
    }
    heap[index] = heap[parentIndex];
    index = parentIndex;
  }
  heap[index] = value;
}

function popHeap<T extends number | ActiveOccurrence>(heap: T[]): T | undefined {
  const first = heap[0];
  const last = heap.pop();
  if (heap.length === 0 || last === undefined) {
    return first;
  }

  let index = 0;
  while (index * 2 + 1 < heap.length) {
    let childIndex = index * 2 + 1;
    if (
      childIndex + 1 < heap.length &&
      getHeapValue(heap[childIndex + 1]) < getHeapValue(heap[childIndex])
    ) {
      childIndex += 1;
    }
    if (getHeapValue(heap[childIndex]) >= getHeapValue(last)) {
      break;
    }
    heap[index] = heap[childIndex];
    index = childIndex;
  }
  heap[index] = last;
  return first;
}

function getHeapValue(value: number | ActiveOccurrence) {
  return typeof value === 'number' ? value : value.endTimestamp;
}

interface ActiveOccurrence {
  endTimestamp: number;
  index: number;
}

type OccurrenceIndexLookup = { [occurrenceKey: string]: number };
