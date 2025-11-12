import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

export function isEventAllDayOrMultipleDay(event: SchedulerEventOccurrence, adapter: Adapter) {
  if (event.allDay) {
    return true;
  }

  return !adapter.isSameDay(event.start.value, event.end.value);
}
