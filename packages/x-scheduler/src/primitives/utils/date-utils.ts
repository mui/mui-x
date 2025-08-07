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

export function getWeekInfoInMonth(adapter: Adapter<string>, date: SchedulerValidDate) {
  const startOfMonth = adapter.startOfMonth(date);
  const endOfMonth = adapter.endOfMonth(date);

  const startOfFirstWeek = adapter.startOfWeek(startOfMonth);
  const startOfTargetDay = adapter.startOfDay(date);

  const daysDiff = startOfTargetDay.diff(startOfFirstWeek, 'days').days!;
  const weekNumber = Math.floor(daysDiff / 7) + 1;

  const endOfTargetWeek = adapter.endOfWeek(date);
  const isLastWeek = adapter.isSameDay(adapter.endOfWeek(endOfMonth), endOfTargetWeek);

  return {
    weekNumber,
    isLastWeek,
  };
}

// TODO: Temporay function, move this to localization layer
export function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}
