import { SchedulerValidDate } from '../models';
import { Adapter } from './adapter/types';

export const mergeDateAndTime = (
  adapter: Adapter,
  dateParam: SchedulerValidDate,
  timeParam: SchedulerValidDate,
): SchedulerValidDate => {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
};
