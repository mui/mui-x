import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithTimePosition, SchedulerValidDate } from '../../models';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { selectors } from '../../use-timeline';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';

export function useTimelinePlaceholderInRange(
  parameters: useTimelinePlaceholderInRange.Parameters,
): useTimelinePlaceholderInRange.ReturnValue {
  const { start, end, occurrences, maxIndex, resourceId } = parameters;
  const store = useTimelineStoreContext();

  const rawPlaceholder = useStore(
    store,
    selectors.occurrencePlaceholderToRenderInTimeRange,
    start,
    end,
    resourceId,
  );

  const originalEventId =
    rawPlaceholder?.type === 'internal-drag-or-resize' ? rawPlaceholder.eventId : null;
  const originalEvent = useStore(store, selectors.event, originalEventId);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const sharedProperties = {
      key: 'occurrence-placeholder',
      start: rawPlaceholder.start,
      end: rawPlaceholder.end,
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
  }, [rawPlaceholder, occurrences, maxIndex, originalEvent]);
}

export namespace useTimelinePlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    /**
     * The resource id of the row in which to render the placeholder.
     */
    resourceId: string | undefined;
  }

  export type ReturnValue = CalendarEventOccurrenceWithTimePosition | null;
}
