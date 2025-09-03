import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowIndex,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import { getEventRowPlacement, GetEventRowPlacementParameters } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';

/**
 * Adds the event occurrences to each day in the row.
 * For the all-day occurrences, it calculates their index in the row (the sub-row they should be rendering in).
 */
export function useRowEventOccurrences(
  parameters: useRowEventOccurrences.Parameters,
): useRowEventOccurrences.ReturnValue {
  const { days, occurrencesMap } = parameters;
  const adapter = useAdapter();

  return React.useMemo(() => {
    const rowIndexLookup: GetEventRowPlacementParameters['rowIndexLookup'] = {};
    const rowLength = days.length;

    return days.map((day, dayIndex) => {
      const allDayOccurrences: CalendarEventOccurrencesWithRowIndex[] = [];
      const occurrences = occurrencesMap.get(day.key);
      rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };

      // Process all-day events and get their position in the row
      for (const occurrence of occurrences?.allDay ?? []) {
        const placement = getEventRowPlacement({
          adapter,
          rowIndexLookup,
          occurrence,
          day,
          previousDay: dayIndex === 0 ? null : days[dayIndex - 1],
          daysBeforeRowEnd: rowLength - dayIndex,
        });

        allDayOccurrences.push({
          ...occurrence,
          placement,
        });

        rowIndexLookup[day.key].occurrencesRowIndex[occurrence.key] = placement.rowIndex;
        rowIndexLookup[day.key].usedRowIndexes.add(placement.rowIndex);
      }

      return {
        ...day,
        regularOccurrences: occurrences?.regular ?? [],
        allDayOccurrences,
      };
    });
  }, [adapter, days, occurrencesMap]);
}

export namespace useRowEventOccurrences {
  export interface Parameters {
    days: CalendarProcessedDate[];
    occurrencesMap: useEventOccurrences.ReturnValue;
  }

  export interface DayData extends CalendarProcessedDate {
    regularOccurrences: CalendarEventOccurrence[];
    allDayOccurrences: CalendarEventOccurrencesWithRowIndex[];
  }

  export type ReturnValue = DayData[];
}
