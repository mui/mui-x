import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithTimePosition, SchedulerValidDate } from '../../models';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
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
  const originalEvent = useStore(store, selectors.event, rawPlaceholder?.eventId ?? null);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const position = occurrences.find(
      (occurrence) => occurrence.key === rawPlaceholder.occurrenceKey,
    )?.position ?? {
      firstIndex: 1,
      lastIndex: maxIndex,
    };

    // Creation mode
    if (!originalEvent) {
      return {
        id: `placeholder-${rawPlaceholder.occurrenceKey}`,
        key: `placeholder-${rawPlaceholder.occurrenceKey}`,
        title: '',
        start: rawPlaceholder.start,
        end: rawPlaceholder.end,
        position,
      };
    }

    return {
      ...originalEvent,
      key: `placeholder-${rawPlaceholder.occurrenceKey}`,
      start: rawPlaceholder.start,
      end: rawPlaceholder.end,
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
