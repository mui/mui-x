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

export function getTimeGridEventPosition({
  adapter,
  columnStart,
  columnEnd,
  start,
  end,
}: {
  adapter: Adapter;
  columnStart: SchedulerValidDate;
  columnEnd: SchedulerValidDate;
  start: SchedulerValidDate;
  end: SchedulerValidDate;
}) {
  const getMinutes = (date: SchedulerValidDate) =>
    adapter.getHours(date) * 60 + adapter.getMinutes(date);

  const minutesInColumn = getMinutes(columnEnd) - getMinutes(columnStart);

  const isStartingBeforeColumnStart = adapter.isBefore(start, columnStart);
  const isEndingAfterColumnEnd = adapter.isAfter(end, columnEnd);
  const startTime = isStartingBeforeColumnStart ? 0 : getMinutes(start) - getMinutes(columnStart);
  const endTime = isEndingAfterColumnEnd
    ? minutesInColumn
    : getMinutes(end) - getMinutes(columnStart);

  const yPositionInt = isStartingBeforeColumnStart ? 0 : (startTime / minutesInColumn) * 100;

  const heightInt = isEndingAfterColumnEnd
    ? 100 - yPositionInt
    : ((endTime - startTime) / minutesInColumn) * 100;

  return {
    yPosition: `${yPositionInt}%`,
    height: `${heightInt}%`,
  };
}
