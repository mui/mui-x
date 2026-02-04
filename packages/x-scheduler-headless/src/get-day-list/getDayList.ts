import { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { isWeekend } from '../use-adapter/useAdapter';
import { processDate } from '../process-date';
import { TemporalAdapter } from '../base-ui-copy/types';

export function getDayList(parameters: GetDaytListParameters): GetDaytListReturnValue {
  const { adapter, start: rawStart, end: rawEnd, excludeWeekends } = parameters;

  const start = adapter.startOfDay(rawStart);
  const end = adapter.endOfDay(rawEnd);

  if (process.env.NODE_ENV !== 'production') {
    if (adapter.isBefore(adapter.startOfDay(end), adapter.startOfDay(start))) {
      throw new Error(
        `MUI: getDayList: The 'end' parameter must be a day after the 'start' parameter.`,
      );
    }
  }

  let current = start;
  let currentDayNumber = adapter.getDayOfWeek(current);
  const days: TemporalSupportedObject[] = [];

  while (adapter.isBefore(current, end)) {
    if (!excludeWeekends || !isWeekend(adapter, current)) {
      days.push(current);
    }

    const prevDayNumber = currentDayNumber;
    current = adapter.addDays(current, 1);
    currentDayNumber = adapter.getDayOfWeek(current);

    // If there is a TZ change at midnight, adding 1 day may only increase the date by 23 hours to 11pm
    // To fix, bump the date into the next day (add 12 hours) and then revert to the start of the day
    // See https://github.com/moment/moment/issues/4743#issuecomment-811306874 for context.
    if (prevDayNumber === currentDayNumber) {
      current = adapter.startOfDay(adapter.addHours(current, 12));
    }
  }

  return days.map((day) => processDate(day, adapter));
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
