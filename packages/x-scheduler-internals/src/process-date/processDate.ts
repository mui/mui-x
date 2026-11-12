import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { BaseTemporal } from '../internals/utils/base-temporal';
import { MS_PER_DAY } from '../internals/utils/plain-date-utils/dayNumber';
import {
  getPlainDateKey,
  plainDateFromDayNumber,
} from '../internals/utils/plain-date-utils/plainDate';
import { toLocalMs, toZonedDateTime } from '../internals/utils/plain-date-utils/timeZone';

/**
 * A processed date. Its zoned date-time is created on the first read of `value`: creating one for
 * every occurrence of the visible range would make their expansion several times slower, and the
 * views only read the other fields. As a getter of the class, `value` isn't copied by a spread.
 */
class ProcessedDate implements SchedulerProcessedDate {
  readonly #timezone: TemporalTimezone;

  #value: BaseTemporal.ZonedDateTime | undefined = undefined;

  constructor(
    public key: string,
    public timestamp: number,
    public minutesInDay: number,
    timezone: TemporalTimezone,
  ) {
    this.#timezone = timezone;
  }

  get value() {
    this.#value ??= toZonedDateTime(this.timestamp, this.#timezone);
    return this.#value;
  }
}

/**
 * Creates the processed date of a date, read in `timezone` from the offsets of the timezone instead
 * of the getters of the date.
 */
export function processDate(
  date: TemporalSupportedObject,
  timezone: TemporalTimezone,
): SchedulerProcessedDate {
  const epochMs = date.getTime();
  // The wall clock is read once, as this runs for each occurrence of the visible range.
  const localMs = toLocalMs(epochMs, timezone);
  const dayNumber = Math.floor(localMs / MS_PER_DAY);
  return new ProcessedDate(
    getPlainDateKey(plainDateFromDayNumber(dayNumber)),
    epochMs,
    Math.floor((localMs - dayNumber * MS_PER_DAY) / 60_000),
    timezone,
  );
}
