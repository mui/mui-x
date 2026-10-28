import type { TemporalAdapter, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDay } from '../models';
import type { BaseTemporal } from '../internals/utils/base-temporal';
import { getDayNumber } from '../internals/utils/base-temporal/PlainDate';
import { createProcessedDate } from '../internals/utils/plain-date-utils/adapter';
import { getSkippedDays, toEpochMs } from '../internals/utils/plain-date-utils/timeZone';
import { isWeekendPlainDate } from '../internals/utils/plain-date-utils/plainDate';

/**
 * Returns the days from `firstPlainDate` to `lastPlainDate`, both included, in `timezone`.
 */
export function getDayListFromPlainDates(parameters: {
  adapter: TemporalAdapter;
  firstPlainDate: BaseTemporal.PlainDate;
  lastPlainDate: BaseTemporal.PlainDate;
  timezone: TemporalTimezone;
  excludeWeekends?: boolean;
}): SchedulerProcessedDay[] {
  const { adapter, firstPlainDate, lastPlainDate, timezone, excludeWeekends } = parameters;
  // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant.
  const skippedDays = getSkippedDays(firstPlainDate, lastPlainDate.add({ days: 1 }), timezone);
  const lastDayNumber = getDayNumber(lastPlainDate);
  const days: SchedulerProcessedDay[] = [];
  for (
    let plainDate = firstPlainDate;
    getDayNumber(plainDate) <= lastDayNumber;
    plainDate = plainDate.add({ days: 1 })
  ) {
    if (
      !skippedDays.has(getDayNumber(plainDate)) &&
      !(excludeWeekends && isWeekendPlainDate(plainDate))
    ) {
      days.push({
        ...createProcessedDate(adapter, toEpochMs(plainDate, 0, timezone), timezone),
        plainDate,
      });
    }
  }

  return days;
}
