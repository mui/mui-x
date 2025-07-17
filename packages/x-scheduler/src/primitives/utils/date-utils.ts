import { TemporalValidDate } from '../models';
import { Adapter } from './adapter/types';

export const mergeDateAndTime = (
  adapter: Adapter,
  dateParam: TemporalValidDate,
  timeParam: TemporalValidDate,
): TemporalValidDate => {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
};
