import type { TemporalAdapter, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate } from '../models';
import type { PlainDate } from '../internals/utils/base-temporal/PlainDate';
import { createProcessedDate } from '../internals/utils/plain-date-utils/adapter';
import { getSkippedDays, toEpochMs } from '../internals/utils/plain-date-utils/timeZone';
import { isWeekendPlainDate } from '../internals/utils/plain-date-utils/plainDate';

/**
 * Returns the days from `firstPlainDate` to `lastPlainDate`, both included, in `timezone`.
 */
export function getDayListFromPlainDates(parameters: {
  adapter: TemporalAdapter;
  firstPlainDate: PlainDate;
  lastPlainDate: PlainDate;
  timezone: TemporalTimezone;
  excludeWeekends?: boolean;
}): GetDaytListReturnValue {
  const { adapter, firstPlainDate, lastPlainDate, timezone, excludeWeekends } = parameters;
  // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant.
  const skippedDays = getSkippedDays(firstPlainDate, lastPlainDate.add({ days: 1 }), timezone);
  const days: SchedulerProcessedDate[] = [];
  for (
    let plainDate = firstPlainDate;
    plainDate.dayNumber <= lastPlainDate.dayNumber;
    plainDate = plainDate.add({ days: 1 })
  ) {
    if (
      !skippedDays.has(plainDate.dayNumber) &&
      !(excludeWeekends && isWeekendPlainDate(plainDate))
    ) {
      days.push(createProcessedDate(adapter, toEpochMs(plainDate, 0, timezone), timezone));
    }
  }

  return days;
}

export type GetDaytListReturnValue = SchedulerProcessedDate[];
