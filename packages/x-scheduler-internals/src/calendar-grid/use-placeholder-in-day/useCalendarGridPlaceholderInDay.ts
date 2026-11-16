import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';
import { normalizeAllDayBounds } from '../../internals/utils/plain-date-utils/date';
import {
  toEpochMs,
  toLocalDayNumber,
  toZonedDateTime,
} from '../../internals/utils/plain-date-utils/timeZone';
import { getDayGridCellSpan } from '../../use-event-occurrences-with-day-grid-position';

export function useCalendarGridPlaceholderInDay(
  day: useEventOccurrencesWithDayGridPosition.DayData,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
  maxEvents?: number,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const store = useEventCalendarStoreContext();
  const { axis, dayNumbers } = useCalendarGridDayRowContext();
  const { start: rowStart, end: rowEnd } = axis;

  const findAvailableIndex = React.useCallback(
    (excludeKey?: string): number => {
      let positionIndex = 1;
      const usedIndexes = new Set(
        day.withPosition.filter((occ) => occ.key !== excludeKey).map((occ) => occ.position.index),
      );
      while (usedIndexes.has(positionIndex)) {
        positionIndex += 1;
      }
      if (maxEvents != null && positionIndex > maxEvents) {
        positionIndex = maxEvents;
      }
      return positionIndex;
    },
    [day, maxEvents],
  );

  const rawPlaceholder = useStore(
    store,
    eventCalendarOccurrencePlaceholderSelectors.placeholderInDayCell,
    day.plainDate,
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
    const allDay =
      rawPlaceholder.type === 'creation' ||
      (rawPlaceholder.type === 'external-drag'
        ? rawPlaceholder.eventData.allDay
        : originalEvent?.allDay);
    const bounds = normalizeAllDayBounds(
      rawPlaceholder.start,
      rawPlaceholder.end,
      allDay,
      displayTimezone,
    );
    // The placeholder covers the cells of every date up to its end, like the occurrences.
    const daySpan = getDayGridCellSpan(
      dayNumbers,
      row.days.indexOf(day),
      toLocalDayNumber(endInRow, displayTimezone),
    );

    const sharedProperties = {
      key: 'occurrence-placeholder',
      id: originalEventId ?? 'occurrence-placeholder',
      title: originalEvent ? originalEvent.title : '',
      allDay,
    };

    // Creation mode
    if (rawPlaceholder.type === 'creation') {
      const creationBounds = normalizeAllDayBounds(
        toEpochMs(day.plainDate, displayTimezone),
        endInRow,
        true,
        displayTimezone,
      );
      return {
        ...sharedProperties,
        title: '',
        allDay: true,
        start: toZonedDateTime(creationBounds.start, displayTimezone),
        end: toZonedDateTime(creationBounds.end, displayTimezone),
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
        start: toZonedDateTime(bounds.start, displayTimezone),
        end: toZonedDateTime(bounds.end, displayTimezone),
        position: {
          index: findAvailableIndex(),
          daySpan,
        },
      };
    }

    return {
      ...sharedProperties,
      start: toZonedDateTime(bounds.start, displayTimezone),
      end: toZonedDateTime(bounds.end, displayTimezone),
      position: {
        index: findAvailableIndex(rawPlaceholder.occurrenceKey),
        daySpan,
      },
    };
  }, [
    day,
    dayNumbers,
    displayTimezone,
    originalEvent,
    originalEventId,
    rawPlaceholder,
    row.days,
    rowEnd,
    findAvailableIndex,
  ]);
}
