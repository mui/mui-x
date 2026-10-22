import type { TemporalAdapter } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { getIsoDayOfWeek } from '../internals/utils/base-temporal/iso';
import {
  createProcessedDate,
  getAdapterDayNumber,
} from '../internals/utils/plain-date-utils/adapter';
import { getDayStartMs, toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

export function getDayList(parameters: GetDaytListParameters): GetDaytListReturnValue {
  const { adapter, start, end, excludeWeekends } = parameters;
  const firstDay = getAdapterDayNumber(adapter, start);
  const lastDay = getAdapterDayNumber(adapter, end);

  if (process.env.NODE_ENV !== 'production') {
    if (lastDay < firstDay) {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: getDayList: The 'end' parameter must be a day after the 'start' parameter.`,
      );
    }
  }

  const timezone = adapter.getTimezone(start);
  const days: SchedulerProcessedDate[] = [];
  for (let dayNumber = firstDay; dayNumber <= lastDay; dayNumber += 1) {
    // ISO weekdays 6 and 7 are Saturday and Sunday.
    if (excludeWeekends && getIsoDayOfWeek(dayNumber) >= 6) {
      continue;
    }
    const dayStartMs = getDayStartMs(dayNumber, timezone);
    // A day the timezone skips, like December 30th, 2011 in Pacific/Apia, has no instant.
    if (toLocalDayNumber(dayStartMs, timezone) === dayNumber) {
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
