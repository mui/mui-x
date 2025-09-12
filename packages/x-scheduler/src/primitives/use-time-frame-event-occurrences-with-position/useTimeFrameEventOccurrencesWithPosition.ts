import * as React from 'react';
import { CalendarEventOccurrence, CalendarEventOccurrenceWithTimePosition } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { Adapter } from '../utils/adapter/types';

/**
 * Places event occurrences for a time frame, where events can have a position spanning multiple indexes if no other event overlaps with them.
 */
export function useTimeFrameEventOccurrencesWithPosition(
  parameters: useTimeFrameEventOccurrencesWithPosition.Parameters,
): useTimeFrameEventOccurrencesWithPosition.ReturnValue {
  const { occurrences, canOccurrencesSpanAcrossMultipleIndexes } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const conflicts = occurrences.map((_occurrence, index) =>
      getConflictingOccurrences(occurrences, index, adapter),
    );

    let maxIndex: number = 1;
    const firstIndexLookup: { [occurrenceKey: string]: number } = {};

    for (const occurrence of conflicts) {
      if (occurrence.conflictsBefore.length === 0) {
        firstIndexLookup[occurrence.key] = 1;
      } else {
        const usedIndexes = new Set(
          occurrence.conflictsBefore.map(
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
      for (const occurrence of conflicts) {
        const usedIndexes = new Set(
          [...occurrence.conflictsBefore, ...occurrence.conflictsAfter].map(
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

export namespace useTimeFrameEventOccurrencesWithPosition {
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

// A small buffer to consider events that are very close but not really overlapping as overlapping.
const COLLISION_BUFFER_MINUTES = 5;

function getConflictingOccurrences(
  occurrences: CalendarEventOccurrence[],
  index: number,
  adapter: Adapter,
) {
  const occurrence = occurrences[index];
  const conflictsBefore: CalendarEventOccurrence[] = [];
  const conflictsAfter: CalendarEventOccurrence[] = [];

  for (let i = index - 1; i >= 0; i -= 1) {
    const occurrenceBefore = occurrences[i];
    if (
      adapter.isAfter(
        adapter.addMinutes(occurrenceBefore.end, COLLISION_BUFFER_MINUTES),
        occurrence.start,
      )
    ) {
      conflictsBefore.push(occurrenceBefore);
    } else {
      // TODO: Try to fix the following dataset (where Event 3 is not considered as conflicting with Event 1, because we break at Event 2):
      // Event 1: 09:00 - 18:00
      // Event 2: 09:30 - 14:00
      // Event 3: 15:00 - 17:00
      break;
    }
  }

  for (let i = index + 1; i < occurrences.length; i += 1) {
    const occurrenceAfter = occurrences[i];
    if (
      adapter.isBefore(
        adapter.addMinutes(occurrenceAfter.start, -COLLISION_BUFFER_MINUTES),
        occurrence.end,
      )
    ) {
      conflictsAfter.push(occurrenceAfter);
    } else {
      // We know that all the next occurrences will start even later, so we can stop here.
      break;
    }
  }

  return { key: occurrence.key, conflictsBefore, conflictsAfter };
}
