import { SchedulerEventId } from '../../models';

interface SchedulerEventLookup {
  /**
   * Fired after events are updated (created, updated, or deleted).
   * Premium plugins can subscribe to this event to sync caches.
   * `created` and `updated` carry full event objects (with all changes already
   * applied) so subscribers can persist them without re-resolving ids through
   * `eventModelStructure`. `deleted` only carries ids since that's enough.
   */
  eventsUpdated: {
    parameters: {
      deleted: SchedulerEventId[];
      updated: any[];
      created: any[];
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
