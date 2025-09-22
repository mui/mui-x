import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithDayGridPosition, SchedulerValidDate } from '../../models';
import { selectors } from '../../use-event-calendar';
import { useEventCalendarStoreContext } from '../../utils/useEventCalendarStoreContext';
import { useDayGridRowContext } from '../row/DayGridRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { diffIn } from '../../utils/date-utils';
import { useAdapter } from '../../utils/adapter/useAdapter';

export function useDayGridPlaceholderInDay(
  day: SchedulerValidDate,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
): CalendarEventOccurrenceWithDayGridPosition | null {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();

  const rawDraggedOccurrence = useStore(
    store,
    selectors.placeholderOccurrenceToRenderInDayCell,
    day,
    rowStart,
    'day-grid',
  );
  const originalEvent = useStore(store, selectors.event, rawDraggedOccurrence?.eventId ?? null);

  return React.useMemo(() => {
    if (!originalEvent || !rawDraggedOccurrence) {
      return null;
    }

    let positionIndex = 1;
    for (const rowDay of row.days) {
      const found = rowDay.withPosition.find(
        (occurrence) => occurrence.key === rawDraggedOccurrence.occurrenceKey,
      );
      if (found) {
        positionIndex = found.position.index;
        break;
      }
    }

    return {
      ...originalEvent,
      key: `placeholder-${rawDraggedOccurrence.occurrenceKey}`,
      start: day,
      end: adapter.isAfter(rawDraggedOccurrence.end, rowEnd) ? rowEnd : rawDraggedOccurrence.end,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, rawDraggedOccurrence.end, day, 'days') + 1,
      },
    };
  }, [adapter, day, originalEvent, rawDraggedOccurrence, row.days, rowEnd]);
}
