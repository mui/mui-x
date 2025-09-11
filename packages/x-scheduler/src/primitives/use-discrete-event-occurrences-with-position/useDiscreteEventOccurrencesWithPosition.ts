import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithTimePosition,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import { useAdapter } from '../utils/adapter/useAdapter';
import { Adapter } from '../utils/adapter/types';
import { addOneDay } from '../use-day-list';
import { processDate } from '../utils/event-utils';

/**
 * This hook is just an PoC of Nora's algorithm to position events in a time grid.
 */
export function useDiscreteEventOccurrencesWithPosition(
  parameters: useDiscreteEventOccurrencesWithPosition.Parameters,
): useDiscreteEventOccurrencesWithPosition.ReturnValue {
  const { start, end, occurrencesMap, areOccurrencesLimitedToASingleIndex } = parameters;
  const adapter = useAdapter();

  // TODO: Improve this logic
  const occurrencesInRange = React.useMemo(() => {
    const tempOccurrences: CalendarEventOccurrence[][] = [];

    let day = start;
    while (adapter.isBeforeDay(day.value, end.value) || adapter.isSameDay(day.value, end.value)) {
      tempOccurrences.push(occurrencesMap.get(day.key) ?? []);
      day = processDate(addOneDay(day.value, adapter), adapter);
    }

    return tempOccurrences.flatMap((dayOccurrences, dayIndex) => {
      let matchingOccurrences = dayOccurrences;
      if (dayIndex === 0) {
        matchingOccurrences = matchingOccurrences.filter((occurrence) =>
          adapter.isAfter(occurrence.end, start.value),
        );
      }

      if (dayIndex === tempOccurrences.length - 1) {
        matchingOccurrences = matchingOccurrences.filter((occurrence) =>
          adapter.isBefore(occurrence.start, end.value),
        );
      }

      return matchingOccurrences;
    });
  }, [adapter, end, start, occurrencesMap]);

  return React.useMemo(() => {
    const occurrencesWithConflicts = occurrencesInRange.map((occurrence, index) => {
      const conflicts = getConflictingOccurrences(occurrencesInRange, index, adapter);
      return { occurrence, conflicts };
    });

    let biggestIndex: number = 1;
    const firstIndexLookup: { [occurrenceKey: string]: number } = {};

    for (const { occurrence, conflicts } of occurrencesWithConflicts) {
      if (conflicts.before.length === 0) {
        firstIndexLookup[occurrence.key] = 1;
      } else {
        const usedIndexes = new Set(
          conflicts.before.map(
            (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence.key],
          ),
        );
        let i = 1;
        while (usedIndexes.has(i)) {
          i += 1;
        }
        firstIndexLookup[occurrence.key] = i;
        if (i > biggestIndex) {
          biggestIndex = i;
        }
      }
    }

    let lastIndexLookup: { [occurrenceKey: string]: number };
    if (areOccurrencesLimitedToASingleIndex) {
      lastIndexLookup = firstIndexLookup;
    } else {
      lastIndexLookup = {};
      for (const { occurrence, conflicts } of occurrencesWithConflicts) {
        const usedIndexes = new Set(
          conflicts.after.map(
            (conflictingOccurrence) => firstIndexLookup[conflictingOccurrence.key],
          ),
        );
        let lastIndex = firstIndexLookup[occurrence.key];
        while (!usedIndexes.has(lastIndex + 1) && lastIndex < biggestIndex) {
          lastIndex += 1;
        }
        lastIndexLookup[occurrence.key] = lastIndex;
      }
    }

    const occurrences = occurrencesInRange.map((occurrence) => ({
      ...occurrence,
      position: {
        firstIndex: firstIndexLookup[occurrence.key],
        lastIndex: lastIndexLookup[occurrence.key],
      },
    }));

    return { occurrences };
  }, [adapter, occurrencesInRange, areOccurrencesLimitedToASingleIndex]);
}

export namespace useDiscreteEventOccurrencesWithPosition {
  export interface Parameters {
    /**
     * The start of the range to add the occurrences to.
     */
    start: CalendarProcessedDate;
    /**
     * The end of the range to add the occurrences to.
     */
    end: CalendarProcessedDate;
    /**
     * The occurrences Map as returned by `useEventOccurrences()`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: useEventOccurrences.ReturnValue;
    /**
     * Whether the occurrences are limited to a single index.
     * If `true`, all occurrences will have their lastIndex equal to their firstIndex.
     * If `false`, the occurrences can span multiple indexes if no other event overlaps with them.
     */
    areOccurrencesLimitedToASingleIndex: boolean;
  }

  export interface ReturnValue {
    /**
     * The occurrences augmented with position information
     */
    occurrences: CalendarEventOccurrencesWithTimePosition[];
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
