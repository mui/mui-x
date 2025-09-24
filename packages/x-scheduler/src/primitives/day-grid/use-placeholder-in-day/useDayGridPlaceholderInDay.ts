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

  const rawPlaceholder = useStore(
    store,
    selectors.occurrencePlaceholderToRenderInDayCell,
    day,
    rowStart,
  );
  const originalEvent = useStore(store, selectors.event, rawPlaceholder?.eventId ?? null);

  return React.useMemo(() => {
    if (!originalEvent || !rawPlaceholder) {
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
