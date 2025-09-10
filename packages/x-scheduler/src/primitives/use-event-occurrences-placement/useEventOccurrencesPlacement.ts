import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithPlacement,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import {
  getEventOccurrencePlacement,
  GetEventOccurrencePlacementParameters,
} from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';

/**
 * Get the event occurrences for the days in a row.
 * It adds placement information for row rendering to each occurrence that needs it.
 */
export function useEventOccurrencesPlacement(
  parameters: useEventOccurrencesPlacement.Parameters,
): useEventOccurrencesPlacement.ReturnValue {
  const { days, occurrencesMap, shouldAddPlacement } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const indexLookup: GetEventOccurrencePlacementParameters['indexLookup'] = {};
    const collectionSize = days.length;

    return days.map((day, dayIndex) => {
      indexLookup[day.key] = { occurrencesIndex: {}, usedIndexes: new Set() };
      const withPlacement: CalendarEventOccurrencesWithPlacement[] = [];
      const withoutPlacement: CalendarEventOccurrence[] = [];

      // Process all-day events and get their position in the row
      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPlacement = shouldAddPlacement ? shouldAddPlacement(occurrence) : true;
        if (hasPlacement) {
          const placement = getEventOccurrencePlacement({
            adapter,
            indexLookup,
            occurrence,
            day,
            previousDay: dayIndex === 0 ? null : days[dayIndex - 1],
            daysBeforeCollectionEnd: collectionSize - dayIndex,
          });

          withPlacement.push({
            ...occurrence,
            placement,
          });

          indexLookup[day.key].occurrencesIndex[occurrence.key] = placement.index;
          indexLookup[day.key].usedIndexes.add(placement.index);
        } else {
          withoutPlacement.push(occurrence);
        }
      }

      return {
        ...day,
        withPlacement,
        withoutPlacement,
        maxConcurrentEvents: Math.max(...indexLookup[day.key].usedIndexes, 1),
      };
    });
  }, [adapter, days, occurrencesMap, shouldAddPlacement]);
}

export namespace useEventOccurrencesPlacement {
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
     * Whether the placement should be computed for this event occurrence.
     * @default () => true
     */
    shouldAddPlacement?: (occurrence: CalendarEventOccurrence) => boolean;
    /**
     * Defines the unit to use to determine if two events are overlapping and should be placed in different rows/columns.
     * - `day`: events are considered overlapping if they are in the same day. This is used when the UI doesn't have a notion of time (e.g: in a Day Grid).
     * - `time`: events are considered overlapping if they overlap in time. This is used when the UI has a notion of time (e.g: in a Time Grid or a Timeline).
     */
    unit: 'day' | 'time';
  }

  export interface DayData extends CalendarProcessedDate {
    /**
     * Occurrences that have been augmented with placement information.
     */
    withPlacement: CalendarEventOccurrencesWithPlacement[];
    /**
     * Occurrences that do not need placement information.
     */
    withoutPlacement: CalendarEventOccurrence[];
    /**
     * The number of rows/columns needed to display all the occurrences with placement for this collection.
     */
    maxConcurrentEvents: number;
  }

  export type ReturnValue = DayData[];
}
