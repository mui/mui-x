import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithTimePosition, SchedulerValidDate } from '../../models';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';

export function useCalendarGridPlaceholderInRange(
  parameters: useCalendarGridPlaceholderInRange.Parameters,
): useCalendarGridPlaceholderInRange.ReturnValue {
  const { start, end, occurrences, maxIndex } = parameters;
  const store = useEventCalendarStoreContext();

  const rawPlaceholder = useStore(
    store,
    selectors.occurrencePlaceholderToRenderInTimeRange,
    start,
    end,
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

    // Creation mode
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

export namespace useCalendarGridPlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export type ReturnValue = CalendarEventOccurrenceWithTimePosition | null;
}
