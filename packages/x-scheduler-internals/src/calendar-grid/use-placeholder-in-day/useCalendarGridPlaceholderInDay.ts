import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerProcessedDay } from '../../models';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { useAdapterContext } from '../../use-adapter-context';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';
import { createProcessedDate } from '../../internals/utils/plain-date-utils/adapter';
import { toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';

export function useCalendarGridPlaceholderInDay(
  day: SchedulerProcessedDay,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
  maxEvents?: number,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { start: rowStart, end: rowEnd } = useCalendarGridDayRowContext().axis;

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
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  return React.useMemo(() => {
    if (!rawPlaceholder) {
      return null;
    }

    // The placeholder can run past the week row: the next rows render their own piece.
    const endInRow = Math.min(rawPlaceholder.end, rowEnd);
    // The placeholder covers every date up to its end, like the occurrences.
    const daySpan = toLocalDayNumber(endInRow, displayTimezone) - day.plainDate.dayNumber + 1;

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
          end: createProcessedDate(adapter, endInRow, displayTimezone),
          timezone: displayTimezone,
        },
        position: {
          index: findAvailableIndex(),
          daySpan,
        },
      };
    }

    if (rawPlaceholder.type === 'external-drag') {
      return {
        ...sharedProperties,
        title: rawPlaceholder.eventData.title ?? '',
        displayTimezone: {
          start: createProcessedDate(adapter, rawPlaceholder.start, displayTimezone),
          end: createProcessedDate(adapter, rawPlaceholder.end, displayTimezone),
          timezone: displayTimezone,
        },
        position: {
          index: findAvailableIndex(),
          daySpan,
        },
      };
    }

    return {
      ...sharedProperties,
      start: createProcessedDate(adapter, rawPlaceholder.start, displayTimezone),
      end: createProcessedDate(adapter, rawPlaceholder.end, displayTimezone),
      displayTimezone: { ...originalEvent!.displayTimezone },
      position: {
        index: findAvailableIndex(rawPlaceholder.occurrenceKey),
        daySpan,
      },
    };
  }, [
    adapter,
    day,
    displayTimezone,
    originalEvent,
    originalEventId,
    rawPlaceholder,
    rowEnd,
    findAvailableIndex,
  ]);
}
