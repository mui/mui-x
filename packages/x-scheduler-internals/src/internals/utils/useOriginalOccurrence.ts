'use client';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
} from '../../models';
import { generateOccurrenceFromEvent } from './event-utils';

/**
 * Returns a lazy builder for the occurrence a drag or resize session starts from.
 */
export function useOriginalOccurrence(
  parameters: useOriginalOccurrence.Parameters,
): () => SchedulerEventOccurrence {
  const { eventId, occurrenceKey, start, end } = parameters;
  const store = useSchedulerStoreContext();

  return useStableCallback(() => {
    const event = schedulerEventSelectors.processedEvent(store.state, eventId)!;
    return generateOccurrenceFromEvent({
      event,
      eventId,
      occurrenceKey,
      start,
      end,
    });
  });
}

export namespace useOriginalOccurrence {
  export interface Parameters {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    /** The rendered display bounds of the occurrence (or segment). */
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
  }
}
