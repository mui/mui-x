import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { CalendarEventOccurrenceWithDayGridPosition, SchedulerValidDate } from '../../models';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';
import { selectors as eventCalendarSelectors } from '../../use-event-calendar';
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
  const { store } = useDayGridRootContext();
  const eventCalendarStore = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();

  const placeholder = useStore(store, selectors.placeholderInDay, day, rowStart, rowEnd);
  const draggedEvent = useStore(
    eventCalendarStore,
    eventCalendarSelectors.event,
    placeholder?.eventId ?? null,
  );

  return React.useMemo(() => {
    if (!draggedEvent || !placeholder) {
      return null;
    }

    let positionIndex = 1;
    for (const rowDay of row.days) {
      // TODO: Use the occurrence key once the primitive uses the Event Calendar store.
      // Right now it would match any occurrence of the same recurring event.
      const found = rowDay.withPosition.find((o) => o.id === draggedEvent.id);
      if (found) {
        positionIndex = found.position.index;
        break;
      }
    }

    return {
      ...draggedEvent,
      start: placeholder.start,
      end: placeholder.end,
      key: `dragged-${draggedEvent.id}`,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, placeholder.end, day, 'days') + 1,
      },
    };
  }, [adapter, day, draggedEvent, placeholder, row.days]);
}
