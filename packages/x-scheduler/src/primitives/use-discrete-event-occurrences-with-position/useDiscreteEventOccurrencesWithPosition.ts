import * as React from 'react';
import { CalendarEventOccurrence, CalendarEventOccurrenceWithTimePosition } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { Adapter } from '../utils/adapter/types';

/**
 * Places event occurrences for a time frame, where events can have a position spanning multiple indexes if no other event overlaps with them.
 */
export function useDiscreteEventOccurrencesWithPosition(
  parameters: useDiscreteEventOccurrencesWithPosition.Parameters,
): useDiscreteEventOccurrencesWithPosition.ReturnValue {
  const { occurrences, canOccurrencesSpanAcrossMultipleIndexes } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const occurrencesWithConflicts = occurrences.map((occurrence, index) => ({
      key: occurrence.key,
      conflicts: getConflictingOccurrences(occurrences, index, adapter),
    }));

    let maxIndex: number = 1;
    const firstIndexLookup: { [occurrenceKey: string]: number } = {};

    for (const occurrence of occurrencesWithConflicts) {
      if (occurrence.conflicts.before.length === 0) {
        firstIndexLookup[occurrence.key] = 1;
      } else {
        const usedIndexes = new Set(
          occurrence.conflicts.before.map(
            (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence.key],
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

    let lastIndexLookup: { [occurrenceKey: string]: number };
    if (canOccurrencesSpanAcrossMultipleIndexes) {
      lastIndexLookup = {};
      for (const occurrence of occurrencesWithConflicts) {
        const usedIndexes = new Set(
          occurrence.conflicts.after.map(
            (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence.key],
          ),
        );
        let lastIndex = firstIndexLookup[occurrence.key];
        while (!usedIndexes.has(lastIndex + 1) && lastIndex < maxIndex) {
          lastIndex += 1;
        }
        lastIndexLookup[occurrence.key] = lastIndex;
      }
    } else {
      lastIndexLookup = firstIndexLookup;
    }

    const occurrencesWithPosition = occurrences.map((occurrence) => ({
      ...occurrence,
      position: {
        firstIndex: firstIndexLookup[occurrence.key],
        lastIndex: lastIndexLookup[occurrence.key],
      },
    }));

    return { occurrences: occurrencesWithPosition, maxIndex };
  }, [adapter, occurrences, canOccurrencesSpanAcrossMultipleIndexes]);
}

export namespace useDiscreteEventOccurrencesWithPosition {
  export interface Parameters {
    /**
     * The occurrences without the position information
     */
    occurrences: CalendarEventOccurrence[];
    /**
     * Whether the occurrences can span across multiple indexes.
     * If `true`, the occurrences can span multiple indexes if no other event overlaps with them.
     * If `false`, all occurrences will have their lastIndex equal to their firstIndex.
     */
    canOccurrencesSpanAcrossMultipleIndexes: boolean;
  }

  export interface ReturnValue {
    /**
     * The occurrences augmented with position information
     */
    occurrences: CalendarEventOccurrenceWithTimePosition[];
    /**
     * The biggest index an event with position has on this time frame.
     */
    maxIndex: number;
  }
}

function getConflictingOccurrences(
  occurrences: CalendarEventOccurrence[],
  index: number,
  adapter: Adapter,
) {
  const occurrence = occurrences[index];
  const occurrencesBefore = occurrences.slice(0, index);
  const occurrencesAfter = occurrences.slice(index + 1);
  const conflictingBefore: CalendarEventOccurrence[] = [];
  const conflictingAfter: CalendarEventOccurrence[] = [];

  for (const occurrenceB of occurrencesBefore) {
    if (adapter.isAfter(occurrenceB.end, occurrence.start)) {
      conflictingBefore.push(occurrenceB);
    } else {
      break;
    }
  }

  for (const occurrenceB of occurrencesAfter) {
    if (adapter.isBefore(occurrenceB.start, occurrence.end)) {
      conflictingAfter.push(occurrenceB);
    } else {
      break;
    }
  }
  return { before: conflictingBefore, after: conflictingAfter };
}
