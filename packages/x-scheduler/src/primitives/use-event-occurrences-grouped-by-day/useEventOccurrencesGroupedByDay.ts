import {
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarProcessedDate,
  SchedulerValidDate,
} from '../models';
import {
  getDateKey,
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
} from '../utils/event-utils';
import { Adapter } from '../utils/adapter/types';

/**
 * Gets all the event occurrences for the given days.
 * For recurring events, it expands them to get all the occurrences that fall within the given days.
 * It should be called once per view to get the occurrences for all the visible days in one go.
 * The returned value is a Map where the key is the day key and the value is the list of occurrences for that day.
 */
export function innerGetEventOccurrencesGroupedByDay(
  adapter: Adapter,
  days: CalendarProcessedDate[],
  renderEventIn: 'first-day' | 'every-day',
  events: CalendarEvent[],
  visibleResources: Map<string, boolean>,
): Map<string, CalendarEventOccurrence[]> {
  // Create a Map of the occurrences grouped by day
  const occurrencesGroupedByDay = new Map<
    string,
    Record<'allDay' | 'nonAllDay', CalendarEventOccurrence[]>
  >(days.map((day) => [day.key, { allDay: [], nonAllDay: [] }]));

  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({ adapter, start, end, events, visibleResources });

  for (const occurrence of occurrences) {
    const eventDays: SchedulerValidDate[] = getDaysTheOccurrenceIsVisibleOn(
      occurrence,
      days,
      adapter,
      renderEventIn,
    );

    for (const day of eventDays) {
      const dayKey = getDateKey(day, adapter);
      const occurrenceType = occurrence.allDay ? 'allDay' : 'nonAllDay';
      occurrencesGroupedByDay.get(dayKey)![occurrenceType].push(occurrence);
    }
  }

  // Make sure the all-day events are before the non-all-day events
  const cleanMap = new Map<string, CalendarEventOccurrence[]>();
  occurrencesGroupedByDay.forEach((value, key) => {
    cleanMap.set(key, [...value.allDay, ...value.nonAllDay]);
  });

  return cleanMap;
}

export type OccurrencesGroupedByDayMap = Map<string, CalendarEventOccurrence[]>;
