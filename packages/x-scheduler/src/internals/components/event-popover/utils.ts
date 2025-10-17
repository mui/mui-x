import { SchedulerValidDate } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

type WhenType = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export function computeRange(adapter: Adapter, next: WhenType, nextIsAllDay: boolean) {
  if (nextIsAllDay) {
    const newStart = adapter.startOfDay(adapter.date(next.startDate));
    const newEnd = adapter.endOfDay(adapter.date(next.endDate));
    return { start: newStart, end: newEnd, surfaceType: 'day-grid' as const };
  }
  // fallback values
  const startTime = next.startTime || '12:00';
  const endTime = next.endTime || '12:30';

  const newStart = adapter.date(`${next.startDate}T${startTime}`);
  const newEnd = adapter.date(`${next.endDate}T${endTime}`);

  return { start: newStart, end: newEnd, surfaceType: 'time-grid' as const };
}

export function validateRange(
  adapter: Adapter,
  start: SchedulerValidDate,
  end: SchedulerValidDate,
  allDay: boolean,
): null | { field: 'startDate' | 'startTime' } {
  const startDay = adapter.startOfDay(start);
  const endDay = adapter.startOfDay(end);
  // endDay <= startDay → date error
  if (adapter.isAfter(startDay, endDay)) {
    return { field: 'startDate' };
  }

  if (adapter.isEqual(startDay, endDay)) {
    if (!allDay && !adapter.isAfter(end, start)) {
      // end <= start → hour error
      return { field: 'startTime' };
    }
  }
  return null;
}
