import * as React from 'react';
import { getAdapter } from '../utils/adapter/getAdapter';
import { SchedulerValidDate } from '../models';

const adapter = getAdapter();

export function useDayList(): useDayList.ReturnValue {
  return React.useCallback(({ date, amount }) => {
    if (process.env.NODE_ENV !== 'production') {
      if (amount <= 0) {
        throw new Error(
          `useDayList: The 'amount' parameter must be a positive number, but received ${amount}.`,
        );
      }
    }

    const start = adapter.startOfDay(date);
    const end = adapter.endOfDay(adapter.addDays(start, amount - 1));

    let current = start;
    let currentDayNumber = adapter.getDayOfWeek(current);
    const days: SchedulerValidDate[] = [];

    while (adapter.isBefore(current, end)) {
      days.push(current);

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

    return days;
  }, []);
}

export namespace useDayList {
  export type ReturnValue = (parameters: ReturnValueParameters) => SchedulerValidDate[];

  export interface ReturnValueParameters {
    /**
     * The date to get the weeks in month for.
     */
    date: SchedulerValidDate;
    /**
     * The amount of days to return.
     */
    amount: number;
  }
}
