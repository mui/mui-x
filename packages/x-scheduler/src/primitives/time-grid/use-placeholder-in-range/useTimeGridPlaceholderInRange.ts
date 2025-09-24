import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithTimePosition, SchedulerValidDate } from '../../models';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';

export function useTimeGridPlaceholderInRange(
  parameters: useTimeGridPlaceholderInRange.Parameters,
): useTimeGridPlaceholderInRange.ReturnValue {
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
    if (!originalEvent || !rawPlaceholder) {
      return null;
    }

    const position = occurrences.find(
      (occurrence) => occurrence.key === rawPlaceholder.occurrenceKey,
    )?.position ?? {
      firstIndex: 1,
      lastIndex: maxIndex,
    };

    return {
      ...originalEvent,
      key: `placeholder-${rawPlaceholder.occurrenceKey}`,
      start: rawPlaceholder.start,
      end: rawPlaceholder.end,
      position,
    };
  }, [originalEvent, rawPlaceholder, occurrences, maxIndex]);
}

export namespace useTimeGridPlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export type ReturnValue = CalendarEventOccurrenceWithTimePosition | null;
}
