import * as React from 'react';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowIndex,
  CalendarProcessedDate,
} from '../models';
import { useEventOccurrences } from '../use-event-occurrences';
import { getEventRowIndex, GetEventRowIndexParameters } from '../utils/event-utils';

/**
 * Adds the event occurrences to each day in the row.
 * For the all-day occurrences, it calculates their index in the row (the sub-row they should be rendering in).
 */
export function useRowEventOccurrences(
  parameters: useRowEventOccurrences.Parameters,
): useRowEventOccurrences.ReturnValue {
  const { days, occurrencesMap } = parameters;

  return React.useMemo(() => {
    const rowIndexLookup: GetEventRowIndexParameters['rowIndexLookup'] = {};
    return days.map((day, dayIndex) => {
      const allDayOccurrences: CalendarEventOccurrencesWithRowIndex[] = [];
      const occurrences = occurrencesMap.get(day.key);
      rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };

      // Process all-day events and get their position in the row
      for (const occurrence of occurrences?.allDay ?? []) {
        const eventRowIndex = getEventRowIndex({
          rowIndexLookup,
          occurrence,
          day,
          previousDay: dayIndex === 0 ? null : days[dayIndex - 1],
        });

        allDayOccurrences.push({
          ...occurrence,
          rowIndex: eventRowIndex,
        });

        rowIndexLookup[day.key].occurrencesRowIndex[occurrence.key] = eventRowIndex;
        rowIndexLookup[day.key].usedRowIndexes.add(eventRowIndex);
      }

      return {
        ...day,
        regularOccurrences: occurrences?.regular ?? [],
        allDayOccurrences,
      };
    });
  }, [days, occurrencesMap]);
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
