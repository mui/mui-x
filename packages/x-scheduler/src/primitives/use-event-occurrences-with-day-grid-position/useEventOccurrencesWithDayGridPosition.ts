import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrenceDayGridPosition,
  CalendarEventOccurrenceWithDayGridPosition,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { useAdapter } from '../utils/adapter/useAdapter';
import { diffIn } from '../utils/date-utils';

/**
 * Places event occurrences for a list of days, where if an event is rendered in a day, it fills the entire day cell (no notion of time).
 */
export function useEventOccurrencesWithDayGridPosition(
  parameters: useEventOccurrencesWithDayGridPosition.Parameters,
): useEventOccurrencesWithDayGridPosition.ReturnValue {
  const { days, occurrencesMap, shouldAddPosition } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const indexLookup: {
      [dayKey: string]: {
        occurrencesIndex: { [occurrenceKey: string]: number };
        usedIndexes: Set<number>;
      };
    } = {};
    const dayListSize = days.length;

    const processedDays = days.map((day, dayIndex) => {
      indexLookup[day.key] = { occurrencesIndex: {}, usedIndexes: new Set() };
      const withPosition: CalendarEventOccurrenceWithDayGridPosition[] = [];
      const withoutPosition: CalendarEventOccurrence[] = [];

      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPosition = shouldAddPosition ? shouldAddPosition(occurrence) : true;
        if (hasPosition) {
          let position: CalendarEventOccurrenceDayGridPosition;

          const occurrenceIndexInPreviousDay =
            dayIndex === 0
              ? null
              : indexLookup[days[dayIndex - 1].key].occurrencesIndex[occurrence.key];

          // If the event is present in the previous day, we keep the same index
          if (occurrenceIndexInPreviousDay != null) {
            position = { index: occurrenceIndexInPreviousDay, daySpan: 1, isInvisible: true };
          }
          // Otherwise, we find the smallest available index
          else {
            const usedIndexes = indexLookup[day.key].usedIndexes;
            let i = 1;
            while (usedIndexes.has(i)) {
              i += 1;
            }

            const durationInDays = diffIn(adapter, occurrence.end, day.value, 'days') + 1;
            position = {
              index: i,
              daySpan: Math.min(durationInDays, dayListSize - dayIndex), // Don't go past the day list end
            };
          }

          indexLookup[day.key].occurrencesIndex[occurrence.key] = position.index;
          indexLookup[day.key].usedIndexes.add(position.index);
          withPosition.push({ ...occurrence, position });
        } else {
          withoutPosition.push(occurrence);
        }
      }

      // Sort the occurrences by their index to make sure they are in the order they should be rendered in.
      withPosition.sort((a, b) => a.position.index - b.position.index);

      return {
        ...day,
        withPosition,
        withoutPosition,
      };
    });

    const usedIndexes = Object.values(indexLookup).flatMap((day) => Array.from(day.usedIndexes));

    return {
      days: processedDays,
      maxIndex: usedIndexes.length === 0 ? 1 : Math.max(...usedIndexes),
    };
  }, [adapter, days, occurrencesMap, shouldAddPosition]);
}

export namespace useEventOccurrencesWithDayGridPosition {
  export interface Parameters {
    /**
     * The days to add the occurrences to.
     */
    days: CalendarProcessedDate[];
    /**
     * The occurrences Map as returned by `useEventOccurrences()`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: useEventOccurrencesGroupedByDay.ReturnValue;
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
    withPosition: CalendarEventOccurrenceWithDayGridPosition[];
    /**
     * Occurrences that do not need position information.
     */
    withoutPosition: CalendarEventOccurrence[];
  }

  export type ReturnValue = {
    /**
     * The occurrences of each day.
     */
    days: DayData[];
    /**
     * The biggest index an event with position has on this day.
     */
    maxIndex: number;
  };
}
