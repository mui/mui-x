import type { TemporalAdapter, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { PlainDate } from '../internals/utils/base-temporal/PlainDate';
import { createPlainDate } from '../internals/utils/base-temporal/PlainDate';
import {
  buildTemporalPlainDate,
  createProcessedDate,
} from '../internals/utils/plain-date-utils/adapter';
import { toEpochMs, toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';
import { isWeekendPlainDate } from '../use-adapter/useAdapter';

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

  return getDayListFromPlainDates(
    adapter,
    firstPlainDate,
    lastPlainDate,
    adapter.getTimezone(start),
    excludeWeekends,
  );
}

/**
 * Returns the days from `firstPlainDate` to `lastPlainDate`, both included, in `timezone`.
 */
export function getDayListFromPlainDates(
  adapter: TemporalAdapter,
  firstPlainDate: PlainDate,
  lastPlainDate: PlainDate,
  timezone: TemporalTimezone,
  excludeWeekends: boolean | undefined,
): GetDaytListReturnValue {
  const days: SchedulerProcessedDate[] = [];
  // Walks day numbers, as `add()` would throw after the last supported day.
  for (
    let dayNumber = firstPlainDate.dayNumber;
    dayNumber <= lastPlainDate.dayNumber;
    dayNumber += 1
  ) {
    const plainDate = createPlainDate(dayNumber, firstPlainDate.calendarId);
    if (excludeWeekends && isWeekendPlainDate(plainDate)) {
      continue;
    }
    const dayStartMs = toEpochMs(plainDate, 0, timezone);
    // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant: its
    // start belongs to the next day.
    if (toLocalDayNumber(dayStartMs, timezone) === plainDate.dayNumber) {
      days.push(createProcessedDate(adapter, dayStartMs, timezone));
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
