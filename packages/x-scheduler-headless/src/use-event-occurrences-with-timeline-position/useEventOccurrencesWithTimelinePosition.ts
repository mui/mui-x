import * as React from 'react';
import { sortEventOccurrences } from '../sort-event-occurrences';
import { SchedulerEventOccurrence, SchedulerEventOccurrencePlaceholder } from '../models';
import { useAdapter, Adapter } from '../use-adapter';

/**
 * Places event occurrences for a timeline UI.
 */
export function useEventOccurrencesWithTimelinePosition(
  parameters: useEventOccurrencesWithTimelinePosition.Parameters,
): useEventOccurrencesWithTimelinePosition.ReturnValue {
  const { occurrences, maxSpan } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const sortedOccurrences = sortEventOccurrences(occurrences);
    const conflicts = buildOccurrenceConflicts(adapter, sortedOccurrences);

    const { firstIndexLookup, maxIndex } = buildFirstIndexLookup(conflicts);

    const lastIndexLookup = buildLastIndexLookup(conflicts, firstIndexLookup, maxIndex, maxSpan);

    const occurrencesWithPosition = sortedOccurrences.map((occurrence) => ({
      ...occurrence,
      position: {
        firstIndex: firstIndexLookup[occurrence.key],
        lastIndex: lastIndexLookup[occurrence.key],
      },
    }));

    return { occurrences: occurrencesWithPosition, maxIndex };
  }, [adapter, occurrences, maxSpan]);
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
    | EventOccurrenceWithPosition
    | EventOccurrencePlaceholderWithPosition;

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

/**
 * Looks for conflicts between occurrences and build a list of conflicts for each occurrence.
 * The provided occurrences need to be sorted by starting date-time.
 */
function buildOccurrenceConflicts(
  adapter: Adapter,
  occurrences: SchedulerEventOccurrence[],
): OccurrenceConflicts[] {
  const getEmptyBlock = (): OccurrenceBlock => ({ occurrences: [], longestDurationMs: 0 });

  const occurrencesBlocks: OccurrenceBlock[] = [];
  let currentBlock: OccurrenceBlock = getEmptyBlock();
  let lastEndTimestamp = 0;

  // Group occurrences in non-overlapping blocks to reduce the number of comparisons when looking for conflicts.
  // Computes the properties needed for each occurrence.
  for (const occurrence of occurrences) {
    const startTimestamp = occurrence.displayTimezone.start.timestamp;
    const endTimestamp = occurrence.displayTimezone.end.timestamp;
    const occurrenceDurationMs = endTimestamp - startTimestamp;

    if (startTimestamp >= lastEndTimestamp) {
      if (currentBlock.occurrences.length > 0) {
        occurrencesBlocks.push(currentBlock);
      }
      currentBlock = getEmptyBlock();
      lastEndTimestamp = 0;
    }

    currentBlock.occurrences.push({
      key: occurrence.key,
      startTimestamp,
      endTimestamp,
    });

    if (occurrenceDurationMs > currentBlock.longestDurationMs) {
      currentBlock.longestDurationMs = occurrenceDurationMs;
    }

    if (endTimestamp > lastEndTimestamp) {
      lastEndTimestamp = endTimestamp;
    }
  }

  if (currentBlock.occurrences.length > 0) {
    occurrencesBlocks.push(currentBlock);
  }

  // For each block, looks for conflicts between occurrences to build the conflicts list.
  const conflicts: OccurrenceConflicts[] = [];
  for (const block of occurrencesBlocks) {
    for (let i = 0; i < block.occurrences.length; i += 1) {
      const occurrence = block.occurrences[i];
      const conflictsBefore = new Set<string>();
      const conflictsAfter = new Set<string>();

      for (let j = i + 1; j < block.occurrences.length; j += 1) {
        const occurrenceA = block.occurrences[j];
        if (occurrenceA.startTimestamp < occurrence.endTimestamp) {
          conflictsAfter.add(occurrenceA.key);
        } else {
          // We know that all the next occurrences will start even later, so we can stop here.
          break;
        }
      }

      for (let j = i - 1; j >= 0; j -= 1) {
        const occurrenceB = block.occurrences[j];
        const diffBetweenOccurrencesStart = occurrence.startTimestamp - occurrenceB.startTimestamp;
        if (diffBetweenOccurrencesStart > block.longestDurationMs) {
          // We know that all the previous occurrences won't end after the start of the occurrence we are getting conflicts for, so we can stop here.
          break;
        }

        if (occurrenceB.endTimestamp > occurrence.startTimestamp) {
          conflictsBefore.add(occurrenceB.key);
        }
      }

      conflicts.push({ key: occurrence.key, before: conflictsBefore, after: conflictsAfter });
    }
  }

  return conflicts;
}

function buildFirstIndexLookup(conflicts: OccurrenceConflicts[]) {
  let maxIndex: number = 1;
  const firstIndexLookup: OccurrenceIndexLookup = {};

  for (const occurrence of conflicts) {
    if (occurrence.before.size === 0) {
      firstIndexLookup[occurrence.key] = 1;
    } else {
      const usedIndexes = new Set(
        Array.from(occurrence.before).map(
          (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence],
        ),
      );
      let i = 1;
      while (usedIndexes.has(i)) {
        i += 1;
      }
      firstIndexLookup[occurrence.key] = i;
      if (i > maxIndex) {
        maxIndex = i;
      }
    }
  }

  return { firstIndexLookup, maxIndex };
}

function buildLastIndexLookup(
  conflicts: OccurrenceConflicts[],
  firstIndexLookup: OccurrenceIndexLookup,
  maxIndex: number,
  maxSpan: number,
) {
  if (maxSpan < 2) {
    return firstIndexLookup;
  }

  const lastIndexLookup: OccurrenceIndexLookup = {};
  for (const occurrence of conflicts) {
    const usedIndexes = new Set(
      [...Array.from(occurrence.before), ...Array.from(occurrence.after)].map(
        (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence],
      ),
    );
    const firstIndex = firstIndexLookup[occurrence.key];
    let lastIndex = firstIndex;
    while (
      !usedIndexes.has(lastIndex + 1) &&
      lastIndex < maxIndex &&
      lastIndex - firstIndex < maxSpan - 1
    ) {
      lastIndex += 1;
    }
    lastIndexLookup[occurrence.key] = lastIndex;
  }

  return lastIndexLookup;
}

/**
 * A block of occurrences that overlap in time.
 * The occurrences of two distinct blocks never overlap in time, their conflicts can thus be computed independently.
 */
interface OccurrenceBlock {
  occurrences: {
    key: string;
    startTimestamp: number;
    endTimestamp: number;
  }[];
  longestDurationMs: number;
}

interface OccurrenceConflicts {
  key: string;
  before: Set<string>;
  after: Set<string>;
}

type OccurrenceIndexLookup = { [occurrenceKey: string]: number };
