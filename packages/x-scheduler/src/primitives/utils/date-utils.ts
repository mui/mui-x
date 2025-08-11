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
