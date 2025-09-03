import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowIndex,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import { useAdapter } from '../utils/adapter/useAdapter';
import { getEventRowIndex, GetEventRowIndexParameters } from '../utils/event-utils';

/**
 * Adds the event occurrences to each day in the row.
 * For the all-day occurrences, it calculates their index in the row (the sub-row they should be rendering in).
 */
export function useRowEventOccurrences(
  parameters: useRowEventOccurrences.Parameters,
): useRowEventOccurrences.ReturnValue {
  const adapter = useAdapter();
  const { days, occurrencesMap } = parameters;

  return React.useMemo(() => {
    const firstDayInRow = days[0];
    return days.map((day) => {
      const allDayOccurrences: CalendarEventOccurrencesWithRowIndex[] = [];
      const rowIndexLookup: GetEventRowIndexParameters['rowIndexLookup'] = {};

      const occurrences = occurrencesMap.get(day.key);

      // Process all-day events and get their position in the row
      for (const occurrence of occurrences?.allDay ?? []) {
        const eventRowIndex = getEventRowIndex({
          adapter,
          rowIndexLookup,
          firstDayInRow,
          occurrence,
          day,
        });

        allDayOccurrences.push({
          ...occurrence,
          eventRowIndex,
        });

        if (!rowIndexLookup[day.key]) {
          rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };
        }
        rowIndexLookup[day.key].occurrencesRowIndex[occurrence.key] = eventRowIndex;
        rowIndexLookup[day.key].usedRowIndexes.add(eventRowIndex);
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
