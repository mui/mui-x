import { SchedulerEventId } from '../../models';

interface SchedulerEventLookup {
  /**
   * Fired after events are created, updated or deleted.
   * `created` and `updated` carry full event objects; `deleted` carries only ids.
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
