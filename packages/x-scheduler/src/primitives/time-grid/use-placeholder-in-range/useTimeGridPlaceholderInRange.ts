import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithTimePosition, SchedulerValidDate } from '../../models';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { selectors } from '../../use-event-calendar';
import { useTimeGridRootContext } from '../root/TimeGridRootContext';
import { useEventOccurrencesWithTimelinePosition } from '../../use-event-occurrences-with-timeline-position';

export function useTimeGridPlaceholderInRange(
  parameters: useTimeGridPlaceholderInRange.Parameters,
): useTimeGridPlaceholderInRange.ReturnValue {
  const { start, end, occurrences, maxIndex } = parameters;
  const store = useEventCalendarStoreContext();
  const { id: gridId } = useTimeGridRootContext();

  const rawDraggedOccurrence = useStore(
    store,
    selectors.draggedOccurrenceToRenderInTimeRange,
    start,
    end,
    gridId,
  );
  const originalEvent = useStore(store, selectors.event, rawDraggedOccurrence?.eventId ?? null);

  return React.useMemo(() => {
    if (!originalEvent || !rawDraggedOccurrence) {
      return null;
    }

    const position = occurrences.find(
      (occurrence) => occurrence.key === rawDraggedOccurrence.occurrenceKey,
    )?.position ?? {
      firstIndex: 1,
      lastIndex: maxIndex,
    };

    return {
      ...originalEvent,
      key: `dragged-${rawDraggedOccurrence.occurrenceKey}`,
      start: rawDraggedOccurrence.start,
      end: rawDraggedOccurrence.end,
      position,
    };
  }, [originalEvent, rawDraggedOccurrence, occurrences, maxIndex]);
}

export namespace useTimeGridPlaceholderInRange {
  export interface Parameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    start: SchedulerValidDate;
    end: SchedulerValidDate;
  }

  export type ReturnValue = CalendarEventOccurrenceWithTimePosition | null;
}
