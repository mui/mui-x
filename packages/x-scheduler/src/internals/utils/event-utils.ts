import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';

export function isEventAllDayOrMultipleDay(event: CalendarEventOccurrence, adapter: Adapter) {
  if (event.allDay) {
    return true;
  }

  return !adapter.isSameDay(event.start, event.end);
}
