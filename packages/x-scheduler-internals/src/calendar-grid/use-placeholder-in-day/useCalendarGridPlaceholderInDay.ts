import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerProcessedDate } from '../../models';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { useAdapterContext } from '../../use-adapter-context';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { processDate } from '../../process-date';
import {
  getAdapterDayNumber,
  getProcessedDayNumber,
  isInternalDragOrResizePlaceholder,
} from '../../internals/utils/drag-utils';

export function useCalendarGridPlaceholderInDay(
  day: SchedulerProcessedDate,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
  maxEvents?: number,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext();

  const findAvailableIndex = React.useCallback(
    (excludeKey?: string): number => {
      let positionIndex = 1;
      const targetDay = row.days.find((rowDay) => rowDay.key === day.key);
      if (targetDay) {
        const usedIndexes = new Set(
          targetDay.withPosition
            .filter((occ) => occ.key !== excludeKey)
            .map((occ) => occ.position.index),
        );
        while (usedIndexes.has(positionIndex)) {
          positionIndex += 1;
        }
      }
      if (maxEvents != null && positionIndex > maxEvents) {
        positionIndex = maxEvents;
      }
      return positionIndex;
    },
    [day, maxEvents, row.days],
  );

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

    // The placeholder can run past the week row: the next rows render their own piece.
    const endInRow =
      adapter.getTime(rawPlaceholder.end) > adapter.getTime(rowEnd) ? rowEnd : rawPlaceholder.end;
    // The placeholder covers every date up to its end, like the occurrences.
    const daySpan =
      getAdapterDayNumber(adapter, endInRow) - getProcessedDayNumber(adapter, day) + 1;

    const sharedProperties = {
      key: 'occurrence-placeholder',
      id: originalEventId ?? 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
    };

    // Creation mode
    if (rawPlaceholder.type === 'creation') {
      return {
        ...sharedProperties,
        title: '',
        allDay: true,
        displayTimezone: {
          // The processed day without the occurrences a row day carries.
          start: {
            value: day.value,
            key: day.key,
            timestamp: day.timestamp,
            minutesInDay: day.minutesInDay,
          },
          end: processDate(endInRow, adapter),
          timezone: adapter.getTimezone(day.value),
        },
        position: {
          index: findAvailableIndex(),
          daySpan,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      const startProcessed = processDate(rawPlaceholder.start, adapter);
      const endProcessed = processDate(rawPlaceholder.end, adapter);

      return {
        ...sharedProperties,
        title: rawPlaceholder.eventData.title ?? '',
        displayTimezone: {
          start: startProcessed,
          end: endProcessed,
          timezone: adapter.getTimezone(rawPlaceholder.start),
        },
        position: {
          index: findAvailableIndex(),
          daySpan,
        },
      };
    }

    return {
      ...sharedProperties,
      start: processDate(rawPlaceholder.start, adapter),
      end: processDate(rawPlaceholder.end, adapter),
      displayTimezone: { ...originalEvent!.displayTimezone },
      position: {
        index: findAvailableIndex(rawPlaceholder.occurrenceKey),
        daySpan,
      },
    };
  }, [adapter, day, originalEvent, originalEventId, rawPlaceholder, rowEnd, findAvailableIndex]);
}
