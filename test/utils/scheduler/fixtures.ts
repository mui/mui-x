import { EventBuilder } from './event-builder';

/**
 * An all-day event on July 4th, 2025, with a `UTC` timezone that all-day events ignore: it covers
 * July 4th in every display timezone. Chain `.recurrent('WEEKLY')`, `.withDisplayTimezone(...)`,
 * etc. as needed.
 */
export function utcJuly4AllDayBuilder() {
  return EventBuilder.new()
    .withDataTimezone('UTC')
    .span('2025-07-04', '2025-07-05', { allDay: true });
}
