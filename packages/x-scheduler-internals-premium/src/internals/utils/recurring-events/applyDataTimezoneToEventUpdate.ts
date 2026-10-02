import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';

export function applyDataTimezoneToEventUpdate({
  adapter,
  originalEvent,
  changes,
}: {
  adapter: Adapter;
  originalEvent: SchedulerProcessedEvent;
  changes: SchedulerEventUpdatedProperties;
}): SchedulerEventUpdatedProperties {
  const dataTz = originalEvent.dataTimezone.timezone;

  const toDataTz = (date: TemporalSupportedObject) => adapter.setTimezone(date, dataTz);

  const result: SchedulerEventUpdatedProperties = { ...changes };

  if (result.start) {
    result.start = toDataTz(result.start);
  }

  if (result.end) {
    result.end = toDataTz(result.end);
  }

  if (result.exDates?.length) {
    result.exDates = result.exDates.map(toDataTz);
  }

  return result;
}
