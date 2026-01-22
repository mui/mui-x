import * as React from 'react';
import { useStore } from '@base-ui/utils/store/useStore';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from '@mui/x-scheduler-headless/internals';
import { processDate } from '@mui/x-scheduler-headless/process-date';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { timelineOccurrencePlaceholderSelectors } from '../../timeline-selectors';

export function usePlaceholderInRow(
  parameters: usePlaceholderInRow.Parameters,
): usePlaceholderInRow.ReturnValue {
  const { occurrences, maxIndex, resourceId } = parameters;

  // Context hooks
  const adapter = useAdapter();
  const store = useTimelineStoreContext();

  // Selector hooks
  const rawPlaceholder = useStore(
    store,
    timelineOccurrencePlaceholderSelectors.placeholderInResource,
    resourceId,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }
    const startProcessed = processDate(rawPlaceholder.start, adapter);
    const endProcessed = processDate(rawPlaceholder.end, adapter);
    const timezone = adapter.getTimezone(rawPlaceholder.start);
    const sharedProperties = {
      id: 'occurrence-placeholder',
      key: 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
      displayTimezone: {
        start: startProcessed,
        end: endProcessed,
        timezone,
      },
    };

    if (rawPlaceholder.type === 'creation') {
      return {
        ...sharedProperties,
        position: {
          firstIndex: 1,
          lastIndex: maxIndex,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        ...sharedProperties,
        title: rawPlaceholder.eventData.title ?? '',
        position: {
          firstIndex: 1,
          lastIndex: maxIndex,
        },
      };
    }

    const position = occurrences.find(
      (occurrence) => occurrence.key === rawPlaceholder.occurrenceKey,
    )?.position ?? {
      firstIndex: 1,
      lastIndex: maxIndex,
    };

    return {
      ...sharedProperties,
      position,
    };
  }, [rawPlaceholder, adapter, originalEvent, occurrences, maxIndex]);
}

export namespace usePlaceholderInRow {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    /**
     * The resource id of the row in which to render the placeholder.
     */
    resourceId: string | null;
  }

  export type ReturnValue =
    useEventOccurrencesWithTimelinePosition.EventOccurrencePlaceholderWithPosition | null;
}
