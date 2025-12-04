import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

export function isOccurrenceAllDayOrMultipleDay(
  occurrence: SchedulerEventOccurrence,
  adapter: Adapter,
) {
  if (occurrence.allDay) {
    return true;
  }

  return !adapter.isSameDay(occurrence.start.value, occurrence.end.value);
}
