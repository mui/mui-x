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
 * Adds the event occurrences to each day in the row.
 * For the all-day occurrences, it calculates their index in the row (the sub-row they should be rendering in).
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
      const withRowPlacement: CalendarEventOccurrencesWithRowPlacement[] = [];
      const withoutRowPlacement: CalendarEventOccurrence[] = [];
      const occurrences = occurrencesMap.get(day.key);
      rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };

      // Process all-day events and get their position in the row
      for (const occurrence of occurrences ?? []) {
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
    days: CalendarProcessedDate[];
    occurrencesMap: useEventOccurrences.ReturnValue;
    /**
     * Whether the row placement should be computed for this event occurrence.
     * @default () => true
     */
    shouldAddPlacement?: (occurrence: CalendarEventOccurrence) => boolean;
  }

  export interface DayData extends CalendarProcessedDate {
    withRowPlacement: CalendarEventOccurrencesWithRowPlacement[];
    withoutRowPlacement: CalendarEventOccurrence[];
    rowCount: number;
  }

  export type ReturnValue = DayData[];
}
