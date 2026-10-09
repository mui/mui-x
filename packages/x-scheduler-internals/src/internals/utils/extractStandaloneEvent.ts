import type { SchedulerEventCreationProperties, SchedulerProcessedEvent } from '../../models';

/**
 * Builds the creation payload for a standalone event derived from `source`, linked via `extractedFromId`.
 */
export function extractStandaloneEvent(
  source: SchedulerProcessedEvent,
  changes: Partial<SchedulerEventCreationProperties>,
): SchedulerEventCreationProperties {
  const createdEvent: SchedulerEventCreationProperties = {
    ...source.modelInBuiltInFormat,
    ...changes,
    extractedFromId: source.id,
  };

  // @ts-expect-error The standalone event receives a new id after removing the original required id.
  delete createdEvent.id;
  delete createdEvent.rrule;
  delete createdEvent.exDates;

  return createdEvent;
}
