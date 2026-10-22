import type { TemporalAdapter, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { PlainDate } from '../internals/utils/base-temporal/PlainDate';
import {
  buildTemporalPlainDate,
  createProcessedDate,
} from '../internals/utils/plain-date-utils/adapter';
import { getSkippedDays, toEpochMs } from '../internals/utils/plain-date-utils/timeZone';
import {
  addDaysToPlainDate,
  isWeekendPlainDate,
} from '../internals/utils/plain-date-utils/plainDate';

export function getDayList(parameters: GetDaytListParameters): GetDaytListReturnValue {
  const { adapter, start, end, excludeWeekends } = parameters;
  const firstPlainDate = buildTemporalPlainDate(adapter, start);
  const lastPlainDate = buildTemporalPlainDate(adapter, end);

  if (process.env.NODE_ENV !== 'production') {
    if (lastPlainDate.dayNumber < firstPlainDate.dayNumber) {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: getDayList: The 'end' parameter must be a day after the 'start' parameter.`,
      );
    }
  }

  return getDayListFromPlainDates({
    adapter,
    firstPlainDate,
    lastPlainDate,
    timezone: adapter.getTimezone(start),
    excludeWeekends,
  });
}

/**
 * Returns the days from `firstPlainDate` to `lastPlainDate`, both included, in `timezone`.
 */
export function getDayListFromPlainDates(parameters: {
  adapter: TemporalAdapter;
  firstPlainDate: PlainDate;
  lastPlainDate: PlainDate;
  timezone: TemporalTimezone;
  excludeWeekends: boolean | undefined;
}): GetDaytListReturnValue {
  const { adapter, firstPlainDate, lastPlainDate, timezone, excludeWeekends } = parameters;
  // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant.
  const skippedDays = getSkippedDays(
    firstPlainDate,
    addDaysToPlainDate(lastPlainDate, 1),
    timezone,
  );
  const days: SchedulerProcessedDate[] = [];
  for (
    let plainDate = firstPlainDate;
    plainDate.dayNumber <= lastPlainDate.dayNumber;
    plainDate = addDaysToPlainDate(plainDate, 1)
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

export interface GetDaytListParameters {
  /**
   * The adapter used to manipulate the date.
   */
  adapter: TemporalAdapter;
  /**
   * The start of the range to generate the day list from.
   */
  start: TemporalSupportedObject;
  /**
   * The end of the range to generate the day list from.
   */
  end: TemporalSupportedObject;
  /**
   * Whether to exclude weekends (Saturday and Sunday) from the returned days.
   * @default false
   */
  excludeWeekends?: boolean;
}

export type GetDaytListReturnValue = SchedulerProcessedDate[];
