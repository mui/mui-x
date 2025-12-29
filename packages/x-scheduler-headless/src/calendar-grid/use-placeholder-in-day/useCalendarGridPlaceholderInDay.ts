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
): useEventOccurrencesWithDayGridPosition.EventOccurrenceWithPosition | null {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell,
    day,
    rowStart,
  );

  const originalEventId = isInternalDragOrResizePlaceholder(rawPlaceholder)
    ? rawPlaceholder.eventId
    : null;
  const originalEvent = useStore(store, schedulerEventSelectors.processedEvent, originalEventId);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    const sharedProperties = {
      key: 'occurrence-placeholder',
      modelInBuiltInFormat: null,
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
        id: 'occurrence-placeholder',
        title: '',
        allDay: true,
        // TODO: Issue #20675 We are forced to return this info, we have to review the data model for placeholders
        dataTimezone: {
          start: startProcessed,
          end: endProcessed,
          timezone,
        },
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
        id: 'occurrence-placeholder',
        title: rawPlaceholder.eventData.title ?? '',
        dataTimezone: {
          start: startProcessed,
          end: endProcessed,
          timezone,
        },
        // TODO: Issue #20675 We are forced to return this info, we have to review the data model for placeholders
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

    return {
      ...originalEvent!,
      ...sharedProperties,
      start: processDate(rawPlaceholder.start, adapter),
      end: processDate(rawPlaceholder.end, adapter),
      position: {
        index: positionIndex,
        daySpan: adapter.differenceInDays(rawPlaceholder.end, day) + 1,
      },
    };
  }, [adapter, day, originalEvent, rawPlaceholder, row.days, rowEnd]);
}
