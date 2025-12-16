import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';
import { timelineOccurrencePlaceholderSelectors } from '../../timeline-selectors';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { isInternalDragOrResizePlaceholder } from '../../utils/drag-utils';
import { processDate } from '../../process-date';
import { useAdapter } from '../../use-adapter';

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
    const timezone = adapter.getTimezone(rawPlaceholder.start);
    const sharedProperties = {
      key: 'occurrence-placeholder',
      // TODO: Issue #20675 We are forced to return this info, we have to review the data model for placeholders
      dataTimezone: {
        start: rawPlaceholder.start,
        end: rawPlaceholder.end,
        timezone,
      },
      displayTimezone: {
        start: processDate(rawPlaceholder.start, adapter),
        end: processDate(rawPlaceholder.end, adapter),
        timezone,
      },
      modelInBuiltInFormat: null,
    };

    if (rawPlaceholder.type === 'creation') {
      return {
        ...sharedProperties,
        id: 'occurrence-placeholder',
        title: '',
        position: {
          firstIndex: 1,
          lastIndex: maxIndex,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        ...sharedProperties,
        id: 'occurrence-placeholder',
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
      ...originalEvent!,
      ...sharedProperties,
      position,
    };
  }, [adapter, rawPlaceholder, occurrences, maxIndex, originalEvent]);
}

export namespace usePlaceholderInRow {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    /**
     * The resource id of the row in which to render the placeholder.
     */
    resourceId: string | null;
  }

  export type ReturnValue =
    useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition | null;
}
