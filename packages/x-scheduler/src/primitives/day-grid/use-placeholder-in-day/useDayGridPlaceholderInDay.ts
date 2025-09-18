import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithDayGridPosition, SchedulerValidDate } from '../../models';
import { selectors } from '../../use-event-calendar';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { useDayGridRowContext } from '../row/DayGridRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { diffIn } from '../../utils/date-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useDayGridRootContext } from '../root/DayGridRootContext';

export function useDayGridPlaceholderInDay(
  day: SchedulerValidDate,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
): CalendarEventOccurrenceWithDayGridPosition | null {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { id: gridId } = useDayGridRootContext();
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();

  const rawDraggedOccurrence = useStore(
    store,
    selectors.draggedOccurrenceToRenderInDayCell,
    day,
    rowStart,
    gridId,
  );
  const originalEvent = useStore(store, selectors.event, rawDraggedOccurrence?.eventId ?? null);

  return React.useMemo(() => {
    if (!originalEvent || !rawDraggedOccurrence) {
      return null;
    }

    let positionIndex = 1;
    for (const rowDay of row.days) {
      // TODO: Use the occurrence key once the primitive uses the Event Calendar store.
      // Right now it would match any occurrence of the same recurring event.
      const found = rowDay.withPosition.find((o) => o.id === originalEvent.id);
      if (found) {
        positionIndex = found.position.index;
        break;
      }
    }

    return {
      ...originalEvent,
      start: day,
      end: adapter.isAfter(rawDraggedOccurrence.end, rowEnd) ? rowEnd : rawDraggedOccurrence.end,
      key: `dragged-${rawDraggedOccurrence.occurrenceKey}`,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, rawDraggedOccurrence.end, day, 'days') + 1,
      },
    };
  }, [adapter, day, originalEvent, rawDraggedOccurrence, row.days, rowEnd]);
}
