import { SchedulerValidDate, CalendarEvent, CalendarProcessedDate } from '../models';
import { Adapter } from './adapter/types';

export function isDayWithinRange(
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
) {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
}

/**
 *  Returns the list of days an event occurrence should be visible on.
 */
export function getDaysTheOccurrenceIsVisibleOn(
  event: CalendarEvent,
  days: CalendarProcessedDate[],
  adapter: Adapter,
  renderEventIn: 'first-day' | 'every-day',
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  if (renderEventIn === 'first-day') {
    if (adapter.isBefore(eventFirstDay, days[0].value)) {
      return [days[0].value];
    }
    return [eventFirstDay];
  }

  const eventLastDay = adapter.endOfDay(event.end);
  return days
    .filter((day) => isDayWithinRange(day.value, eventFirstDay, eventLastDay, adapter))
    .map((day) => day.value);
}

/**
 * Creates a CalendarProcessedDate object from a date object.
 */
export function processDate(date: SchedulerValidDate, adapter: Adapter): CalendarProcessedDate {
  return {
    value: date,
    key: getDateKey(date, adapter),
  };
}

/**
 * Returns a string representation of the date.
 * It can be used as key in Maps or passed to the React `key` property when looping through days.
 * It only contains date information, two dates representing the same day but with different time will have the same key.
 */
export function getDateKey(day: SchedulerValidDate, adapter: Adapter): string {
  return adapter.format(day, 'keyboardDate');
}
