import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { TemporalSupportedObject } from '../../models';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { processDate } from '../../process-date';
import { useAdapter } from '../../use-adapter';
import { isInternalDragOrResizePlaceholder } from '../../utils/drag-utils';

export function useCalendarGridPlaceholderInRange(
  parameters: useCalendarGridPlaceholderInRange.Parameters,
): useEventOccurrencesWithTimelinePosition.EventOccurrenceWithPosition | null {
  const { start, end, occurrences, maxIndex } = parameters;

  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInTimeRange,
    start,
    end,
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

export namespace useCalendarGridPlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    start: TemporalSupportedObject;
    end: TemporalSupportedObject;
  }
}
