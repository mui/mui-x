import { CalendarProcessedDate, SchedulerValidDate } from '../models';
import { Adapter } from './adapter/types';
import { processDate } from './event-utils';

export function mergeDateAndTime(
  adapter: Adapter,
  dateParam: SchedulerValidDate,
  timeParam: SchedulerValidDate,
): SchedulerValidDate {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
}

export function isWeekend(adapter: Adapter, value: SchedulerValidDate): boolean {
  const sunday = adapter.format(adapter.date('2025-08-09'), 'weekday');
  const saturday = adapter.format(adapter.date('2025-08-10'), 'weekday');
  const formattedValue = adapter.format(value, 'weekday');

  return formattedValue === sunday || formattedValue === saturday;
}

/**
 * Differences in units.
 * TODO: move to adapter methods for DST/zone safety.
 */

const MS_MIN = 60000;
const MS_DAY = 86400000;
const MS_WEEK = 7 * MS_DAY;

export function diffIn(
  adapter: Adapter,
  a: SchedulerValidDate,
  b: SchedulerValidDate,
  unit: 'minutes' | 'days' | 'weeks' | 'months' | 'years',
): number {
  switch (unit) {
    case 'minutes': {
      const msA = adapter.toJsDate(a).getTime();
      const msB = adapter.toJsDate(b).getTime();
      return Math.floor((msA - msB) / MS_MIN);
    }
    case 'days': {
      const yA = adapter.getYear(a);
      const mA = adapter.getMonth(a);
      const dA = adapter.getDate(a);
      const yB = adapter.getYear(b);
      const mB = adapter.getMonth(b);
      const dB = adapter.getDate(b);
      const utcA = Date.UTC(yA, mA, dA);
      const utcB = Date.UTC(yB, mB, dB);
      return Math.floor((utcA - utcB) / MS_DAY);
    }
    case 'weeks': {
      const A = adapter.startOfWeek(a);
      const B = adapter.startOfWeek(b);
      const yA = adapter.getYear(A);
      const mA = adapter.getMonth(A);
      const dA = adapter.getDate(A);
      const yB = adapter.getYear(B);
      const mB = adapter.getMonth(B);
      const dB = adapter.getDate(B);
      const utcA = Date.UTC(yA, mA, dA);
      const utcB = Date.UTC(yB, mB, dB);
      return Math.floor((utcA - utcB) / MS_WEEK);
    }
    case 'months': {
      const ya = adapter.getYear(a);
      const yb = adapter.getYear(b);
      const ma = adapter.getMonth(a);
      const mb = adapter.getMonth(b);
      return ya * 12 + ma - (yb * 12 + mb);
    }
    case 'years': {
      return adapter.getYear(a) - adapter.getYear(b);
    }
    default:
      return 0;
  }
}

export function getDayList(parameters: GetDayListParameters): CalendarProcessedDate[] {
  const { adapter, firstDay, lastDay, showWeekends } = parameters;
  let current = firstDay;
  let currentDayNumber = adapter.getDayOfWeek(current);
  const days: SchedulerValidDate[] = [];

  while (adapter.isBeforeDay(current, lastDay)) {
    if (showWeekends || !isWeekend(adapter, current)) {
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

interface GetDayListParameters {
  adapter: Adapter;
  firstDay: SchedulerValidDate;
  lastDay: SchedulerValidDate;
  showWeekends: boolean;
}
