import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import type { useEventOccurrencesWithDayGridPosition } from '../../use-event-occurrences-with-day-grid-position';
import { eventCalendarOccurrencePlaceholderSelectors } from '../../event-calendar-selectors';
import { isInternalDragOrResizePlaceholder } from '../../internals/utils/drag-utils';
import {
  getPlaceholderOccurrence,
  getPlaceholderOccurrenceKey,
} from '../../internals/utils/placeholder-occurrence';
import { getLastInstant } from '../../internals/utils/event-utils';
import { toEpochMs, toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';
import { getDayGridCellSpan } from '../../use-event-occurrences-with-day-grid-position';

export function useCalendarGridPlaceholderInDay(
  day: useEventOccurrencesWithDayGridPosition.DayData,
  row: useEventOccurrencesWithDayGridPosition.ReturnValue,
  maxEvents?: number,
): useEventOccurrencesWithDayGridPosition.EventOccurrencePlaceholderWithPosition | null {
  const store = useEventCalendarStoreContext();
  const { axis, dayNumbers } = useCalendarGridDayRowContext();
  const { start: rowStart, end: rowEnd } = axis;

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

    // A creation renders its piece of this row, from the day of the cell to the end of the row,
    // and `getPlaceholderOccurrence()` snaps that piece to whole days.
    const placeholder =
      rawPlaceholder.type === 'creation'
        ? {
            ...rawPlaceholder,
            start: toEpochMs(day.plainDate, displayTimezone),
            end: Math.min(rawPlaceholder.end, rowEnd + 1),
          }
        : rawPlaceholder;
    const occurrence = getPlaceholderOccurrence(placeholder, originalEvent, displayTimezone);
    // The placeholder can run past the week row: the next rows render their own piece.
    const lastInstantInRow = Math.min(
      getLastInstant(occurrence.end.epochMilliseconds, occurrence.allDay),
      rowEnd,
    );
    // The placeholder covers the cells of every date up to its end, like the occurrences.
    const daySpan = getDayGridCellSpan(
      dayNumbers,
      row.days.indexOf(day),
      toLocalDayNumber(lastInstantInRow, displayTimezone),
    );

    // The first row of the day that no other occurrence uses, capped to the rows the cell shows.
    const occurrenceKey = getPlaceholderOccurrenceKey(rawPlaceholder);
    const usedIndexes = new Set(
      day.withPosition
        .filter((item) => item.key !== occurrenceKey)
        .map((item) => item.position.index),
    );
    let index = 1;
    while (usedIndexes.has(index)) {
      index += 1;
    }
    if (maxEvents != null && index > maxEvents) {
      index = maxEvents;
    }

    return {
      ...occurrence,
      position: { index, daySpan },
    };
  }, [
    day,
    dayNumbers,
    displayTimezone,
    maxEvents,
    originalEvent,
    rawPlaceholder,
    row.days,
    rowEnd,
  ]);
}
