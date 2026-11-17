import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import type { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { getPlaceholderOccurrence } from '../../internals/utils/placeholder-occurrence';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';

export function useCalendarGridPlaceholderInRange(
  parameters: useCalendarGridPlaceholderInRange.Parameters,
): useEventOccurrencesWithTimelinePosition.EventOccurrencePlaceholderWithPosition | null {
  const { start, end, occurrences, maxIndex } = parameters;
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
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const position = (isInternalDragOrResizePlaceholder(rawPlaceholder)
      ? occurrences.find((occurrence) => occurrence.key === rawPlaceholder.occurrenceKey)?.position
      : undefined) ?? { firstIndex: 1, lastIndex: maxIndex };

    return {
      ...getPlaceholderOccurrence(rawPlaceholder, originalEvent, displayTimezone),
      position,
    };
  }, [rawPlaceholder, displayTimezone, originalEvent, occurrences, maxIndex]);
}

export namespace useCalendarGridPlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    /**
     * The first instant of the range, as a timestamp read in the display timezone.
     */
    start: number;
    /**
     * The end of the range, as a timestamp read in the display timezone: the end of a time column,
     * or the last instant of a day row.
     */
    end: number;
  }
}
