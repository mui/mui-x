import {
  SchedulerEvent,
  SchedulerEventCreationProperties,
  SchedulerProcessedEvent,
} from '../../../models';

/**
 * Generates the property to pass to `store.updateEvents()` to create an event extracted from a potentially recurring event.
 */
export function createEventFromRecurringEvent(
  originalEvent: SchedulerProcessedEvent,
  changes: Partial<SchedulerEventCreationProperties>,
): SchedulerEventCreationProperties {
  const createdEvent: SchedulerEventCreationProperties = {
    ...originalEvent.modelInBuiltInFormat,
    ...changes,
    extractedFromId: originalEvent.id,
  };

  // @ts-ignore
  delete createdEvent.id;
  delete createdEvent.rrule;
  delete createdEvent.exDates;

  return createdEvent;
}
