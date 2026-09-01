'use client';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
} from '../../models';
import type { SchedulerOccurrenceDataBounds } from './event-utils';
import { generateOccurrenceFromEvent } from './event-utils';

/**
 * Returns a lazy builder for the occurrence a drag or resize session starts from,
 * carrying the data-timezone identity next to the rendered display bounds. Shared by
 * the grid event primitives so the occurrence shape stays consistent across grids.
 */
export function useOriginalOccurrence(
  parameters: useOriginalOccurrence.Parameters,
): () => SchedulerEventOccurrence {
  const { eventId, occurrenceKey, start, end, dataBounds } = parameters;
  const store = useSchedulerStoreContext();

  return useStableCallback(() => {
    const event = schedulerEventSelectors.processedEvent(store.state, eventId)!;
    return generateOccurrenceFromEvent({ event, eventId, occurrenceKey, start, end, dataBounds });
  });
}

export namespace useOriginalOccurrence {
  export interface Parameters {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    /** The rendered display bounds of the occurrence (or segment). */
    start: SchedulerProcessedDate;
    end: SchedulerProcessedDate;
    /** The occurrence bounds in the data timezone; see `generateOccurrenceFromEvent`. */
    dataBounds?: SchedulerOccurrenceDataBounds;
  }
}
