import type { SchedulerProcessedDay } from '../models';
import type { BaseTemporal } from '../internals/utils/base-temporal';
import { createProcessedDate } from '../internals/utils/plain-date-utils/date';
import { getSkippedDays, toEpochMs } from '../internals/utils/plain-date-utils/timeZone';
import {
  getDayNumber,
  plainDateFromDayNumber,
} from '../internals/utils/plain-date-utils/plainDate';

/**
 * Returns the days from `firstPlainDate` to `lastPlainDate`, both included, in `timezone`.
 */
export function getDayListFromPlainDates(parameters: {
  firstPlainDate: BaseTemporal.PlainDate;
  lastPlainDate: BaseTemporal.PlainDate;
  timezone: string;
  /**
   * The ISO weekdays to leave out, like the weekend of the locale.
   */
  excludedWeekdays?: readonly number[];
}): SchedulerProcessedDay[] {
  const { firstPlainDate, lastPlainDate, timezone, excludedWeekdays } = parameters;
  // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant.
  const skippedDays = getSkippedDays(firstPlainDate, lastPlainDate.add({ days: 1 }), timezone);
  const lastDayNumber = getDayNumber(lastPlainDate);
  const days: SchedulerProcessedDay[] = [];
  // Walks the day numbers, so each day reuses its cached plain date instead of building one with `add()`.
  for (let dayNumber = getDayNumber(firstPlainDate); dayNumber <= lastDayNumber; dayNumber += 1) {
    const plainDate = plainDateFromDayNumber(dayNumber);
    if (!skippedDays.has(dayNumber) && !excludedWeekdays?.includes(plainDate.dayOfWeek)) {
      days.push({
        ...createProcessedDate(toEpochMs(plainDate, 0, timezone), timezone),
        plainDate,
      });
    }
  }

  return days;
}
