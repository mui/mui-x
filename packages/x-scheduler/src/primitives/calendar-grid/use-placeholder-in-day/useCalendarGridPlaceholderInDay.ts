import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithDayGridPosition, SchedulerValidDate } from '../../models';
import { selectors } from '../../use-event-calendar';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { useAdapter, diffIn } from '../../use-adapter/useAdapter';

export function useCalendarGridPlaceholderInDay(
  day: SchedulerValidDate,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
): CalendarEventOccurrenceWithDayGridPosition | null {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();

  const rawPlaceholder = useStore(
    store,
    selectors.occurrencePlaceholderToRenderInDayCell,
    day,
    rowStart,
  );
  const originalEvent = useStore(store, selectors.event, rawPlaceholder?.eventId ?? null);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    let positionIndex = 1;
    for (const rowDay of row.days) {
      const found = rowDay.withPosition.find(
        (occurrence) => occurrence.key === rawPlaceholder.occurrenceKey,
      );
      if (found) {
        positionIndex = found.position.index;
        break;
      }
    }

    // Creation mode
    if (!originalEvent) {
      return {
        id: `placeholder-${rawPlaceholder.occurrenceKey}`,
        key: `placeholder-${rawPlaceholder.occurrenceKey}`,
        title: '',
        allDay: true,
        start: day,
        end: adapter.isAfter(rawPlaceholder.end, rowEnd) ? rowEnd : rawPlaceholder.end,
        position: {
          index: positionIndex,
          daySpan: diffIn(adapter, rawPlaceholder.end, day, 'days') + 1,
        },
      };
    }

    return {
      ...originalEvent,
      key: `placeholder-${rawPlaceholder.occurrenceKey}`,
      start: day,
      end: adapter.isAfter(rawPlaceholder.end, rowEnd) ? rowEnd : rawPlaceholder.end,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, rawPlaceholder.end, day, 'days') + 1,
      },
    };
  }, [adapter, day, originalEvent, rawPlaceholder, row.days, rowEnd]);
}
