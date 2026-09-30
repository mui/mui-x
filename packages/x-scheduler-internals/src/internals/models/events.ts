import type { SchedulerEventId } from '../../models';

interface SchedulerEventLookup<TEvent extends object> {
  /**
   * Fired after events are created, updated or deleted.
   * `created` and `updated` carry full event objects; `deleted` carries only ids.
   */
  eventsUpdated: {
    parameters: {
      deleted: SchedulerEventId[];
      updated: TEvent[];
      created: TEvent[];
      newEvents: TEvent[];
    };
  };
}

export type SchedulerEvents = keyof SchedulerEventLookup<object>;

export type SchedulerEventListener<TEvent extends object, E extends SchedulerEvents> = (
  params: SchedulerEventParameters<TEvent, E>,
) => void;

export type SchedulerEventParameters<
  TEvent extends object,
  E extends SchedulerEvents,
> = SchedulerEventLookup<TEvent>[E] extends { parameters: infer P } ? P : undefined;
