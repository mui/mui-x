import * as React from 'react';
import { CalendarEventOccurrence, CalendarEventOccurrenceWithTimePosition } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { sortOccurrences } from '../utils/event-utils';

// A small buffer to consider events that are very close but not really overlapping as overlapping.
const COLLISION_BUFFER_MINUTES = 5;

/**
 * Places event occurrences for a timeline UI.
 */
export function useEventOccurrencesWithTimelinePosition(
  parameters: useEventOccurrencesWithTimelinePosition.Parameters,
): useEventOccurrencesWithTimelinePosition.ReturnValue {
  const { occurrences, canOccurrencesSpanAcrossMultipleIndexes } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    let longestOccurrence: CalendarEventOccurrence | null = null;
    let longestOccurrenceDurationMs = 0;
    for (const occurrence of occurrences) {
      // TODO: Add adapter.getDurationMs method
      const occurrenceDurationMs =
        adapter.toJsDate(occurrence.end).getTime() - adapter.toJsDate(occurrence.start).getTime();
      if (occurrenceDurationMs > longestOccurrenceDurationMs) {
        longestOccurrenceDurationMs = occurrenceDurationMs;
        longestOccurrence = occurrence;
      }
    }

    if (longestOccurrence == null) {
      return { occurrences: [], maxIndex: 0 };
    }

    const occurrencesSortedByEndDate = sortOccurrences(occurrences, adapter, 'end');
    const occurrencesSortedByEndDateIndexLookup: { [occurrenceKey: string]: number } = {};
    occurrencesSortedByEndDate.forEach((occurrence, index) => {
      occurrencesSortedByEndDateIndexLookup[occurrence.key] = index;
    });

    const conflicts: {
      key: string;
      conflictsBefore: Set<string>;
      conflictsAfter: Set<string>;
    }[] = [];
    for (let i = 0; i < occurrences.length; i++) {
      const occurrence = occurrences[i];
      const conflictsBefore = new Set<string>();
      const conflictsAfter = new Set<string>();

      for (let j = i + 1; j < occurrences.length; j += 1) {
        const occurrenceAfter = occurrences[j];
        if (
          adapter.isBefore(
            adapter.addMinutes(occurrenceAfter.start, -COLLISION_BUFFER_MINUTES),
            occurrence.end,
          )
        ) {
          conflictsAfter.add(occurrenceAfter.key);
        } else {
          // We know that all the next occurrences will start even later, so we can stop here.
          break;
        }
      }

      for (let j = i - 1; j >= 0; j -= 1) {
        const occurrenceBefore = occurrences[j];
        const diffBetweenOccurenceBeforeStartsAndOccurenceStarts =
          adapter.toJsDate(occurrence.start).getTime() -
          adapter.toJsDate(occurrenceBefore.start).getTime();
        if (diffBetweenOccurenceBeforeStartsAndOccurenceStarts > longestOccurrenceDurationMs) {
          // We know that all the previous occurrences won't end after the start of the occurrence we are getting conflicts for, so we can stop here.
          break;
        }

        if (
          adapter.isAfter(
            adapter.addMinutes(occurrenceBefore.end, COLLISION_BUFFER_MINUTES),
            occurrence.start,
          )
        ) {
          conflictsBefore.add(occurrenceBefore.key);
        }
      }

      conflicts.push({ key: occurrence.key, conflictsBefore, conflictsAfter });
    }

    let maxIndex: number = 1;
    const firstIndexLookup: { [occurrenceKey: string]: number } = {};

    for (const occurrence of conflicts) {
      if (occurrence.conflictsBefore.size === 0) {
        firstIndexLookup[occurrence.key] = 1;
      } else {
        const usedIndexes = new Set(
          Array.from(occurrence.conflictsBefore).map(
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

    let lastIndexLookup: { [occurrenceKey: string]: number };
    if (canOccurrencesSpanAcrossMultipleIndexes) {
      lastIndexLookup = {};
      for (const occurrence of conflicts) {
        const usedIndexes = new Set(
          [...Array.from(occurrence.conflictsBefore), ...Array.from(occurrence.conflictsAfter)].map(
            (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence],
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

export namespace useEventOccurrencesWithTimelinePosition {
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
