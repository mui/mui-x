import { SchedulerEventId, SchedulerEventUpdatedProperties } from '../../models';

interface SchedulerEventLookup {
  /**
   * Fired after events are updated (created, updated, or deleted).
   * Premium plugins can subscribe to this event to sync caches.
   */
  eventsUpdated: {
    parameters: {
      deleted: SchedulerEventId[];
      updated: Map<SchedulerEventId, SchedulerEventUpdatedProperties>;
      created: SchedulerEventId[];
      newEvents: any[];
    };
  };
}

export type SchedulerEvents = keyof SchedulerEventLookup;

export type SchedulerEventListener<E extends SchedulerEvents> = (
  params: SchedulerEventParameters<E>,
) => void;

export type SchedulerEventParameters<E extends SchedulerEvents> = SchedulerEventLookup[E] extends {
  parameters: infer P;
}
  ? P
  : undefined;
