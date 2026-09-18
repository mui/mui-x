import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type { SchedulerStoreInContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';

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

/**
 * Deletes an occurrence immediately or opens the recurring scope dialog.
 * Returns whether the event was deleted immediately. For a recurring event,
 * `onSubmit` runs after the user confirms the scope; canceling does not call it.
 */
export function deleteEventOccurrence(
  store: SchedulerStoreInContext<any, any>,
  occurrence: SchedulerRenderableEventOccurrence,
  onSubmit?: () => void,
): boolean {
  if (
    schedulerOtherSelectors.areRecurringEventsAvailable(store.state) &&
    occurrence.displayTimezone.rrule
  ) {
    store.deleteRecurringEvent({
      occurrenceStart: occurrence.displayTimezone.start.value,
      eventId: occurrence.id,
      onSubmit,
    });
    return false;
  }

  store.deleteEvent(occurrence.id);
  return true;
}
