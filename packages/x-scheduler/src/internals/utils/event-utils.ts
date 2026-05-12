import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { Adapter } from '@mui/x-scheduler-internals/use-adapter';

export function isOccurrenceAllDayOrMultipleDay(
  occurrence: SchedulerRenderableEventOccurrence,
  adapter: Adapter,
) {
  if (occurrence.allDay) {
    return true;
  }

  return !adapter.isSameDay(
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
  );
}
