import * as React from 'react';
import { useStore } from '@base-ui/utils/store/useStore';
import { TemporalSupportedObject } from '../../models';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { useAdapter } from '../../use-adapter/useAdapter';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { processDate } from '../../process-date';
import { isInternalDragOrResizePlaceholder } from '../../utils/drag-utils';

export function useCalendarGridPlaceholderInDay(
  day: TemporalSupportedObject,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell,
    day,
    rowStart,
  );

  const originalEvent = useStore(store, (state) => {
    if (!isInternalDragOrResizePlaceholder(rawPlaceholder)) {
      return null;
    }
    return schedulerEventSelectors.processedEventRequired(state, rawPlaceholder.eventId);
  });

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const sharedProperties = {
      key: 'occurrence-placeholder',
      id: 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
    };

    // Creation mode
    if (rawPlaceholder.type === 'creation') {
      const startProcessed = processDate(day, adapter);
      const endProcessed = processDate(
        adapter.isAfter(rawPlaceholder.end, rowEnd) ? rowEnd : rawPlaceholder.end,
        adapter,
      );
      const timezone = adapter.getTimezone(day);
      return {
        ...sharedProperties,
        title: '',
        allDay: true,
        displayTimezone: {
          start: startProcessed,
          end: endProcessed,
          timezone,
        },
        position: {
          index: 1,
          daySpan: adapter.differenceInDays(rawPlaceholder.end, day) + 1,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      const startProcessed = processDate(rawPlaceholder.start, adapter);
      const endProcessed = processDate(rawPlaceholder.end, adapter);
      const timezone = adapter.getTimezone(rawPlaceholder.start);

      return {
        ...sharedProperties,
        title: rawPlaceholder.eventData.title ?? '',
        displayTimezone: {
          start: startProcessed,
          end: endProcessed,
          timezone,
        },
        position: {
          index: 1,
          daySpan: adapter.differenceInDays(rawPlaceholder.end, day) + 1,
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

    if (!originalEvent) {
      throw new Error('Scheduler: expected original event for internal drag placeholder.');
    }

    return {
      ...sharedProperties,
      start: processDate(rawPlaceholder.start, adapter),
      end: processDate(rawPlaceholder.end, adapter),
      displayTimezone: { ...originalEvent.displayTimezone },
      position: {
        index: positionIndex,
        daySpan: adapter.differenceInDays(rawPlaceholder.end, day) + 1,
      },
    };
  }, [adapter, day, originalEvent, rawPlaceholder, row.days, rowEnd]);
}
