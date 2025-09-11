import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencePosition,
  CalendarEventOccurrencesWithPosition,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import { useAdapter } from '../utils/adapter/useAdapter';
import { diffIn } from '../utils/date-utils';

/**
 * Places event occurrences for a list of days, where if an event is rendered in a day, it fills the entire day cell (no notion of time).
 */
export function useDayListEventOccurrencesWithPosition(
  parameters: useDayListEventOccurrencesWithPosition.Parameters,
): useDayListEventOccurrencesWithPosition.ReturnValue {
  const { days, occurrencesMap, shouldAddPosition } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const indexLookup: {
      [dayKey: string]: {
        occurrencesIndex: { [occurrenceKey: string]: number };
        usedIndexes: Set<number>;
      };
    } = {};
    const collectionSize = days.length;

    return days.map((day, dayIndex) => {
      indexLookup[day.key] = { occurrencesIndex: {}, usedIndexes: new Set() };
      const withPosition: CalendarEventOccurrencesWithPosition[] = [];
      const withoutPosition: CalendarEventOccurrence[] = [];

      // Process all-day events and get their position in the row
      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPosition = shouldAddPosition ? shouldAddPosition(occurrence) : true;
        if (hasPosition) {
          let position: CalendarEventOccurrencePosition;

          const occurrenceIndexInPreviousDay =
            dayIndex === 0
              ? null
              : indexLookup[days[dayIndex - 1].key]?.occurrencesIndex[occurrence.key];

          // If the event is present in the previous day, we keep the same index
          if (occurrenceIndexInPreviousDay != null) {
            position = { index: occurrenceIndexInPreviousDay, span: 0 };
          }
          // Otherwise, we find the smallest available index
          else {
            const usedIndexes = indexLookup[day.key]?.usedIndexes;
            let i = 1;
            if (usedIndexes) {
              while (usedIndexes.has(i)) {
                i += 1;
              }
            }

            const durationInDays = diffIn(adapter, occurrence.end, day.value, 'days') + 1;
            const columnSpan = Math.min(durationInDays, collectionSize - dayIndex); // Don't go past the collection end

            position = { index: i, span: columnSpan };
          }

          withPosition.push({
            ...occurrence,
            position,
          });

          indexLookup[day.key].occurrencesIndex[occurrence.key] = position.index;
          indexLookup[day.key].usedIndexes.add(position.index);
        } else {
          withoutPosition.push(occurrence);
        }
      }

      return {
        ...day,
        withPosition,
        withoutPosition,
        concurrentEvents: Math.max(...indexLookup[day.key].usedIndexes, 1),
      };
    });
  }, [adapter, days, occurrencesMap, shouldAddPosition]);
}

export namespace useDayListEventOccurrencesWithPosition {
  export interface Parameters {
    /**
     * The days to add the occurrences to.
     */
    days: CalendarProcessedDate[];
    /**
     * The occurrences Map as returned by `useEventOccurrences()`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: useEventOccurrences.ReturnValue;
    /**
     * Whether the position should be computed for this event occurrence.
     * @default () => true
     */
    shouldAddPosition?: (occurrence: CalendarEventOccurrence) => boolean;
  }

  export interface DayData extends CalendarProcessedDate {
    /**
     * Occurrences that have been augmented with position information.
     */
    withPosition: CalendarEventOccurrencesWithPosition[];
    /**
     * Occurrences that do not need position information.
     */
    withoutPosition: CalendarEventOccurrence[];
    /**
     * The number of rows/columns needed to display all the occurrences with position for this collection.
     */
    concurrentEvents: number;
  }

  export type ReturnValue = DayData[];
}
