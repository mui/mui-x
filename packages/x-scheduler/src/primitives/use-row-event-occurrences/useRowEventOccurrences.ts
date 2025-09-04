import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowPlacement,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import {
  getEventOccurrenceRowPlacement,
  GetEventOccurrenceRowPlacementParameters,
} from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';

/**
 * Get the event occurrences for the days in a row.
 * It adds placement information for row rendering to each occurrence that needs it.
 */
export function useAddRowPlacementToEventOccurrences(
  parameters: useAddRowPlacementToEventOccurrences.Parameters,
): useAddRowPlacementToEventOccurrences.ReturnValue {
  const { days, occurrencesMap, shouldAddPlacement } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const rowIndexLookup: GetEventOccurrenceRowPlacementParameters['rowIndexLookup'] = {};
    const rowLength = days.length;

    return days.map((day, dayIndex) => {
      rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };
      const withRowPlacement: CalendarEventOccurrencesWithRowPlacement[] = [];
      const withoutRowPlacement: CalendarEventOccurrence[] = [];

      // Process all-day events and get their position in the row
      for (const occurrence of occurrencesMap.get(day.key) ?? []) {
        const hasPlacement = shouldAddPlacement ? shouldAddPlacement(occurrence) : true;
        if (hasPlacement) {
          const placement = getEventOccurrenceRowPlacement({
            adapter,
            rowIndexLookup,
            occurrence,
            day,
            previousDay: dayIndex === 0 ? null : days[dayIndex - 1],
            daysBeforeRowEnd: rowLength - dayIndex,
          });

          withRowPlacement.push({
            ...occurrence,
            placement,
          });

          rowIndexLookup[day.key].occurrencesRowIndex[occurrence.key] = placement.rowIndex;
          rowIndexLookup[day.key].usedRowIndexes.add(placement.rowIndex);
        } else {
          withoutRowPlacement.push(occurrence);
        }
      }

      return {
        ...day,
        withRowPlacement,
        withoutRowPlacement,
        rowCount: Math.max(...rowIndexLookup[day.key].usedRowIndexes, 1),
      };
    });
  }, [adapter, days, occurrencesMap, shouldAddPlacement]);
}

export namespace useAddRowPlacementToEventOccurrences {
  export interface Parameters {
    /**
     * The days to add the occurrences to.
     */
    days: CalendarProcessedDate[];
    /**
     * The occurrences Map as returned by `useEventOccurrences`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: useEventOccurrences.ReturnValue;
    /**
     * Whether the row placement should be computed for this event occurrence.
     * @default () => true
     */
    shouldAddPlacement?: (occurrence: CalendarEventOccurrence) => boolean;
  }

  export interface DayData extends CalendarProcessedDate {
    /**
     * Occurrences that have been augmented with row placement information.
     */
    withRowPlacement: CalendarEventOccurrencesWithRowPlacement[];
    /**
     * Occurrences that do not need row placement information.
     */
    withoutRowPlacement: CalendarEventOccurrence[];
    /**
     * The number of rows needed to display all the occurrences with placement for this day.
     */
    rowCount: number;
  }

  export type ReturnValue = DayData[];
}
