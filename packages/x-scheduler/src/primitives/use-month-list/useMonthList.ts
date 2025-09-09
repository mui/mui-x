import * as React from 'react';
import { SchedulerValidDate } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';

export function useMonthList(): useMonthList.ReturnValue {
  const adapter = useAdapter();

  return React.useCallback(
    ({ date, amount }) => {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof amount === 'number' && amount <= 0) {
          throw new Error(
            `useMonthList: The 'amount' parameter must be a positive number, but received ${amount}.`,
          );
        }
      }

      const start = adapter.startOfMonth(date);
      const end =
        amount === 'end-of-year'
          ? adapter.endOfYear(date)
          : adapter.startOfMonth(adapter.addMonths(start, amount));

      let current = start;
      const months: SchedulerValidDate[] = [];

      while (adapter.isBefore(current, end)) {
        months.push(current);

        current = adapter.addMonths(current, 1);
      }

      return months;
    },
    [adapter],
  );
}

export namespace useMonthList {
  export type ReturnValue = (parameters: ReturnValueParameters) => SchedulerValidDate[];

  export interface ReturnValueParameters {
    /**
     * The date to get the months in month for.
     */
    date: SchedulerValidDate;
    /**
     * The amount of months to return.
     * When equal to "end-of-year", the method will return all the months until the end of the year.
     * When equal to a number, the method will return that many months.
     * Put it to 6 to have a fixed number of months across months in Gregorian calendars.
     */
    amount: number | 'end-of-year';
  }
}
