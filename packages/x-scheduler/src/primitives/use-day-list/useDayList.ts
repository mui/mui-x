import * as React from 'react';
import { isWeekend } from '../utils/date-utils';
import { CalendarProcessedDate, SchedulerValidDate } from '../models';
import { useAdapter } from '../utils/adapter/useAdapter';
import { processDate } from '../utils/event-utils';

export function useDayList(): useDayList.ReturnValue {
  const adapter = useAdapter();

  return React.useCallback(
    ({ date, amount, excludeWeekends }) => {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof amount === 'number' && amount <= 0) {
          throw new Error(
            `useDayList: The 'amount' parameter must be a positive number, but received ${amount}.`,
          );
        }
      }

      const start = adapter.startOfDay(date);
      let current = start;
      let currentDayNumber = adapter.getDayOfWeek(current);
      const days: SchedulerValidDate[] = [];

      const isDayCollectionComplete =
        typeof amount === 'number'
          ? () => days.length >= amount
          : () => adapter.isAfter(current, adapter.endOfDay(adapter.addDays(start, 6)));

      while (!isDayCollectionComplete()) {
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
    },
    [adapter],
  );
}

export namespace useDayList {
  export type ReturnValue = (parameters: ReturnValueParameters) => CalendarProcessedDate[];

  export interface ReturnValueParameters {
    /**
     * The date to get the weeks in month for.
     */
    date: SchedulerValidDate;
    /**
     * The amount of days to return.
     * When equal to 'week', generates a 7-day range starting from `date`.
     * The actual number of returned days may be less if `excludeWeekends` is true.
     * When a number, generates that many consecutive days.
     */
    amount: number | 'week';
    /**
     * Whether to exclude weekends (Saturday and Sunday) from the returned days.
     * @default false
     */
    excludeWeekends?: boolean;
  }
}
