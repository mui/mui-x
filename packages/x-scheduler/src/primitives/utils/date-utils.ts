import { SchedulerValidDate } from '../models';
import { Adapter } from './adapter/types';

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
  const dayOfWeek = adapter.getDayOfWeek(value);

  return dayOfWeek === 6 || dayOfWeek === 7;
}

// TODO: Issue #19128 - This function will be used to support 'onWeekday' and 'onLastWeekday' modes.

// export function getWeekInfoInMonth(adapter: Adapter, date: SchedulerValidDate) {
//   const startOfMonth = adapter.startOfMonth(date);
//   const endOfMonth = adapter.endOfMonth(date);

//   const startOfFirstWeek = adapter.startOfWeek(startOfMonth);
//   const startOfTargetDay = adapter.startOfDay(date);

//   const daysDiff = diffIn(adapter, startOfTargetDay, startOfFirstWeek, 'days');
//   const weekNumber = Math.floor(daysDiff / 7) + 1;

//   const endOfTargetWeek = adapter.endOfWeek(date);
//   const isLastWeek = adapter.isSameDay(adapter.endOfWeek(endOfMonth), endOfTargetWeek);

//   return { weekNumber, isLastWeek };
// }

// TODO: Temporay function, move this to localization layer
export function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

/**
 * Differences in units using the adapter.
 * Avoids DST/time issues by anchoring to the correct units.
 */
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
      return Math.floor((msA - msB) / 60000);
    }
    case 'days': {
      const A = adapter.startOfDay(a);
      const B = adapter.startOfDay(b);
      const msA = adapter.toJsDate(A).getTime();
      const msB = adapter.toJsDate(B).getTime();
      return Math.floor((msA - msB) / 86400000);
    }
    case 'weeks': {
      const A = adapter.startOfWeek(a);
      const B = adapter.startOfWeek(b);
      const msA = adapter.toJsDate(A).getTime();
      const msB = adapter.toJsDate(B).getTime();
      return Math.floor((msA - msB) / 604800000);
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
