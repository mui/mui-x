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

  const originalEventId =
    rawPlaceholder?.type === 'internal-drag-or-resize' ? rawPlaceholder.eventId : null;
  const originalEvent = useStore(store, selectors.event, originalEventId);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const sharedProperties = {
      key: 'occurrence-placeholder',
      start: rawPlaceholder.start,
      end: rawPlaceholder.end,
    };

    // Creation mode
    if (rawPlaceholder.type === 'creation') {
      return {
        ...sharedProperties,
        id: 'occurrence-placeholder',
        title: '',
        allDay: true,
        start: day,
        end: adapter.isAfter(rawPlaceholder.end, rowEnd) ? rowEnd : rawPlaceholder.end,
        position: {
          index: 1,
          daySpan: diffIn(adapter, rawPlaceholder.end, day, 'days') + 1,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        ...sharedProperties,
        id: 'occurrence-placeholder',
        title: rawPlaceholder.eventData.title ?? '',
        position: {
          index: 1,
          daySpan: diffIn(adapter, rawPlaceholder.end, day, 'days') + 1,
        },
      };
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
      ...originalEvent!,
      ...sharedProperties,
      position: {
        index: positionIndex,
        daySpan: diffIn(adapter, rawPlaceholder.end, day, 'days') + 1,
      },
    };
  }, [adapter, day, originalEvent, rawPlaceholder, row.days, rowEnd]);
}
