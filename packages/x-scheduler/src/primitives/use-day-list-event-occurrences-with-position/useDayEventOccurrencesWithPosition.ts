import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithPosition,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import {
  getEventOccurrencePositionInDayList,
  GetEventOccurrencePositionInDayListParameters,
} from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';

/**
 * Places event occurrences for a list of days, where if an event is rendered in a day, it fills the entire day cell (no notion of time).
 */
export function useDayListEventOccurrencesWithPosition(
  parameters: useDayListEventOccurrencesWithPosition.Parameters,
): useDayListEventOccurrencesWithPosition.ReturnValue {
  const { days, occurrencesMap, shouldAddPosition } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const indexLookup: GetEventOccurrencePositionInDayListParameters['indexLookup'] = {};
    const collectionSize = days.length;

    return days.map((day, dayIndex) => {
      indexLookup[day.key] = { occurrencesIndex: {}, usedIndexes: new Set() };
      const withPosition: CalendarEventOccurrencesWithPosition[] = [];
      const withoutPosition: CalendarEventOccurrence[] = [];

      // Process all-day events and get their position in the row
      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPosition = shouldAddPosition ? shouldAddPosition(occurrence) : true;
        if (hasPosition) {
          const position = getEventOccurrencePositionInDayList({
            adapter,
            indexLookup,
            occurrence,
            day,
            previousDay: dayIndex === 0 ? null : days[dayIndex - 1],
            daysBeforeCollectionEnd: collectionSize - dayIndex,
          });

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
        maxConcurrentEvents: Math.max(...indexLookup[day.key].usedIndexes, 1),
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
    maxConcurrentEvents: number;
  }

  export type ReturnValue = DayData[];
}
